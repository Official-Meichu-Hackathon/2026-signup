export interface PlayerData {
  name: string
  gender: string
  birthday: string
  idNumber: string
  identity: string
  school: string
  department: string
  grade: string
  occupation: string
  email: string
  phone: string
  dietaryRestrictions: string
  shirtSize: string
}

export const createPlayerData = (): PlayerData => ({
  name: '',
  gender: '',
  birthday: '',
  idNumber: '',
  identity: '',
  school: '',
  department: '',
  grade: '',
  occupation: '',
  email: '',
  phone: '',
  dietaryRestrictions: '',
  shirtSize: '',
})

export interface RegistrationData {
  groupName: string
  playerCountChoice: string
  isCrossDomain: string
  priorityOrder: string[]
  players: PlayerData[]
  assentFirst: string
  assentSecond: string
  // 其他 step (per 2026 design): team-level upload + attendance questions
  lowIncomeProof: File | null
  workshopAttendance: string
  ceremonyAttendance: string
}

export const MAX_PLAYERS = 5

export const PLAYER_COUNT_OPTIONS = ['3人', '4人', '5人']

// Default 志願序 order from the 2026 design (design/components/報名頁面摺頁)
export const PRIORITY_OPTIONS = [
  'CloudMosa',
  'NXP',
  'TSMC',
  '羅技',
  'Google',
  'AMD',
  '創客交流組',
]

export const GENDER_OPTIONS = ['男', '女']

export const IDENTITY_OPTIONS = ['學生', '社會人士']

export const SHIRT_SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', '2XL']

export const PLAYER_ORDER_LABELS = ['一', '二', '三', '四', '五']
