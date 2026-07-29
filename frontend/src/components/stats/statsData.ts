export type StatsSlice = {
  label: string
  value: number
  /** 設計稿 Frame 39（2505:87672）每一片的填色 */
  color: string
}

export type StatsChart = {
  title: string
  /** 第一片的起始角，單位為度、自 12 點鐘方向順時針 */
  startAngle: number
  slices: StatsSlice[]
}

// 設計 token（與 index.css 的 --color-* 同源）
const INK = '#F6F6F6' // 主要文字色
const PERIWINKLE = '#A5BDE2' // 輔助文字色02
const DARKBLUE = '#2D3E63' // 主色
const ROYAL = '#4664AC' // 輔助色01
const LILAC = '#B1A2CA' // 輔助色02
const GREY = '#D8D8D8' // 輔助文字色01

// 切片順序、起始角與配色都是從設計稿的圓餅素材反解出來的：每個切片素材的路徑
// 幾何可解出圓心、半徑與起訖角，四顆的半徑都精準是 115.65（= 231.3/2），每片的
// 結束角都等於下一片的起始角（誤差 <0.5°），百分比總和 100.0～100.1（與標籤上的
// 四捨五入一致）。故這份資料等同設計稿本身，改數字即可，不需要重新匯出素材。
export const STATS_CHARTS = {
  grade: {
    title: '2025參賽者年級分布',
    startAngle: 339.5,
    slices: [
      { label: '大一', value: 2.5, color: LILAC },
      { label: '大二', value: 21.5, color: DARKBLUE },
      { label: '大三', value: 32.6, color: GREY },
      { label: '大四', value: 30.6, color: PERIWINKLE },
      { label: '大五', value: 1.7, color: INK },
      { label: '碩博', value: 11.2, color: ROYAL },
    ],
  },
  school: {
    title: '2025參賽者學校分布',
    startAngle: 0,
    slices: [
      { label: '國立清華大學', value: 27.3, color: LILAC },
      { label: '國立臺灣大學', value: 4.5, color: INK },
      { label: '其他', value: 6.2, color: ROYAL },
      { label: '國立中央大學', value: 2.9, color: PERIWINKLE },
      { label: '國立成功大學', value: 5, color: DARKBLUE },
      { label: '國立陽明交通大學', value: 51.7, color: ROYAL },
      { label: '國立臺灣師範大學', value: 2.5, color: INK },
    ],
  },
  hackerDepartment: {
    title: '2025黑客組院系分布',
    startAngle: 0,
    slices: [
      { label: '電機資訊學院', value: 57.6, color: PERIWINKLE },
      { label: '工學院', value: 8.4, color: DARKBLUE },
      { label: '醫學領域相關', value: 4.7, color: ROYAL },
      { label: '管理學院', value: 3.7, color: LILAC },
      { label: '其他', value: 25.7, color: INK },
    ],
  },
  makerDepartment: {
    title: '2025創客組院系分布',
    startAngle: 0,
    slices: [
      { label: '電機資訊學院', value: 56.9, color: PERIWINKLE },
      { label: '工學院', value: 27.5, color: DARKBLUE },
      { label: '醫學領域相關', value: 3.9, color: ROYAL },
      { label: '管理學院', value: 7.8, color: LILAC },
      { label: '其他', value: 3.9, color: INK },
    ],
  },
} satisfies Record<string, StatsChart>
