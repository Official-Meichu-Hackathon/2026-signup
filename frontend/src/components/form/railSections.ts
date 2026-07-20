// The left rail maps to the 4 form SECTIONS (per-player steps live under
// 'basic'). Navigation is backward-only: a section is clickable once reached.
export type Section = 'option' | 'basic' | 'consent' | 'other'

export interface RailSection {
  section: Section
  label: string
}

// Plain label mapping — the rail is now drawn in pure CSS (no PNG tabs).
export const RAIL_SECTIONS: RailSection[] = [
  { section: 'option', label: '報名選項' },
  { section: 'basic', label: '基本資料' },
  { section: 'consent', label: '填寫同意書' },
  { section: 'other', label: '其他' },
]
