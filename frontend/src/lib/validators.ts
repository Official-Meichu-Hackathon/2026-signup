// Taiwan national ID / residence certificate validation.

const countyCode: Record<string, string> = {
  A: '10',
  B: '11',
  C: '12',
  D: '13',
  E: '14',
  F: '15',
  G: '16',
  H: '17',
  I: '34',
  J: '18',
  K: '19',
  L: '20',
  M: '21',
  N: '22',
  O: '35',
  P: '23',
  Q: '24',
  R: '25',
  S: '26',
  T: '27',
  U: '28',
  V: '29',
  W: '32',
  X: '30',
  Y: '31',
  Z: '33',
}

function isNationalIdNumberValid(id: string): boolean {
  const regex = /^([A-Z])[1,2]\d{8}$/
  const match = id.match(regex)
  if (!match) return false

  const code = id.replace(match[1], countyCode[match[1]])
  const multiplier = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1]
  const sum = code
    .split('')
    .reduce((prev, curr, idx) => prev + Number(curr) * multiplier[idx], 0)

  return sum % 10 === 0
}

function isNewResidenceCertificateNumberValid(id: string): boolean {
  const regex = /^([A-Z])[8,9]\d{8}$/
  const match = id.match(regex)
  if (!match) return false

  const code = id.replace(match[1], countyCode[match[1]])
  const codeArr = code.split('').map((c) => parseInt(c, 10))
  const checkDigit = codeArr.splice(-1, 1)[0]
  const multiplier = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1]
  const base = codeArr.reduce(
    (prev, curr, idx) => prev + ((curr * multiplier[idx]) % 10),
    0,
  )
  const expected = base % 10 === 0 ? 0 : 10 - (base % 10)

  return expected === checkDigit
}

function isOldResidenceCertificateNumberValid(id: string): boolean {
  const regex = /^([A-Z])([A,B,C,D])\d{8}$/
  const match = id.match(regex)
  if (!match) return false

  const [, county, sex] = match
  const code = id.replace(
    `${county}${sex}`,
    `${countyCode[county]}${parseInt(countyCode[sex], 10) % 10}`,
  )
  const multiplier = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1]
  const sum = code
    .split('')
    .reduce((prev, curr, idx) => prev + Number(curr) * multiplier[idx], 0)

  return sum % 10 === 0
}

export const isValidId = (id: string): boolean =>
  isNewResidenceCertificateNumberValid(id) ||
  isOldResidenceCertificateNumberValid(id) ||
  isNationalIdNumberValid(id)

export const validateGroupName = (name: string): boolean =>
  !name || name.length <= 20

// Length cap for free-text fields (e.g. 參賽者經歷, ≤100 chars).
export const validateMaxLength =
  (max: number) =>
  (value: string): boolean =>
    value.length <= max

export const validateEmail = (email: string): boolean =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)

export const validatePhoneNumber = (phone: string): boolean =>
  /^09\d{8}$/.test(phone)

export const validateBirthday = (birthday: string): boolean => {
  if (!/^\d{8}$/.test(birthday)) return false

  const year = parseInt(birthday.substring(0, 4), 10)
  const month = parseInt(birthday.substring(4, 6), 10)
  const day = parseInt(birthday.substring(6, 8), 10)

  if (year < 1900 || year > new Date().getFullYear()) return false
  if (month < 1 || month > 12) return false
  if (day < 1 || day > 31) return false

  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}
