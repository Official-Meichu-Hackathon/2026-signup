export type StatsSlice = {
  label: string
  value: number
}

export type StatsChart = {
  title: string
  slices: StatsSlice[]
}

export const STATS_CHARTS = {
  grade: {
    title: '2025參賽者年級分布',
    slices: [
      { label: '大一', value: 2.5 },
      { label: '大二', value: 21.5 },
      { label: '大三', value: 32.6 },
      { label: '大四', value: 30.6 },
      { label: '大五', value: 1.7 },
      { label: '碩博', value: 11.2 },
    ],
  },
  school: {
    title: '2025參賽者學校分布',
    slices: [
      { label: '國立陽明交通大學', value: 51.7 },
      { label: '國立清華大學', value: 27.3 },
      { label: '國立成功大學', value: 5 },
      { label: '國立臺灣師範大學', value: 2.5 },
      { label: '國立臺灣大學', value: 4.5 },
      { label: '國立中央大學', value: 2.9 },
      { label: '其他', value: 6.2 },
    ],
  },
  hackerDepartment: {
    title: '2025黑客組院系分布',
    slices: [
      { label: '電機資訊學院', value: 57.6 },
      { label: '工學院', value: 8.4 },
      { label: '醫學領域相關', value: 4.7 },
      { label: '管理學院', value: 3.7 },
      { label: '其他', value: 25.7 },
    ],
  },
  makerDepartment: {
    title: '2025創客組院系分布',
    slices: [
      { label: '電機資訊學院', value: 56.9 },
      { label: '工學院', value: 27.5 },
      { label: '醫學領域相關', value: 3.9 },
      { label: '管理學院', value: 7.8 },
      { label: '其他', value: 3.9 },
    ],
  },
} satisfies Record<string, StatsChart>
