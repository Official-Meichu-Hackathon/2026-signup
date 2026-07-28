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
  // 參賽者經歷 (each ≤100 chars)
  selfIntro: string
  motivation: string
  project: string
  competitionExp: string
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
  selfIntro: '',
  motivation: '',
  project: '',
  competitionExp: '',
})

export interface RegistrationData {
  groupName: string
  playerCountChoice: string
  isCrossDomain: string
  priorityOrder: string[]
  players: PlayerData[]
  assent: string
  // 其他 step (per 2026 design): team-level upload + attendance questions
  lowIncomeProof: File | null
  workshopAttendance: string
  ceremonyAttendance: string
}

export const MAX_PLAYERS = 5

// 參賽者經歷 char cap
export const EXPERIENCE_MAX = 100

export const PLAYER_COUNT_OPTIONS = ['3人', '4人', '5人']

// 黑客組 志願序: this year's 7 companies + 創客交流組 fallback.
export const PRIORITY_OPTIONS = [
  'AMD',
  'CloudMosa',
  'Google',
  '恩智浦半導體',
  '愛德萬測試',
  '羅技',
  '聚陽實業',
  '創客交流組',
]

// 創客組 (?ref=maker): locked to the maker group alone.
export const MAKER_PRIORITY_OPTIONS = ['創客交流組']

export const GENDER_OPTIONS = ['男', '女']

export const IDENTITY_OPTIONS = ['學生', '社會人士']

export const SHIRT_SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', '2XL']

export const PLAYER_ORDER_LABELS = ['一', '二', '三', '四', '五']
