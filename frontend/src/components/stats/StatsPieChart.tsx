import type { StatsChart } from './statsData'

// 兩種尺規：
//   showLabels=false（手機版沿用）—— 圓餅佔滿畫布的一半，外圍不留空間。
//   showLabels=true （電腦版，設計稿 2505:87672）—— 圓餅只佔 1/3，左右各留一個
//   直徑的空間給外接標籤；設計稿最長的標籤（國立陽明交通大學）就是往外延伸約一
//   個直徑，所以留這麼多才放得下。
const PLAIN = { box: 100, radius: 25 }
const LABELLED = { box: 300, radius: 50 }

// 設計稿的標籤：Noto Sans Medium 12 / 行高 12，標籤白色、%數用輔助文字色02。
// 12 是「設計稿 px」，換算成 viewBox 單位 = 12 × (100 / 231.3)。
const DESIGN_PIE_DIAMETER = 231.3
const toUnits = (designPx: number) =>
  (designPx * (LABELLED.radius * 2)) / DESIGN_PIE_DIAMETER
const LABEL_SIZE = toUnits(12)
const LABEL_GAP = toUnits(9.5) // 設計稿兩行文字中心相距 19
const ELBOW = toUnits(16) // 弧上往外的短斜線
// 再水平拉出去的長度。上限由最右邊那顆圓餅決定：它的圓心距面板右緣 255，扣掉
// 半徑 115.65、肘點 16、文字間距 5，再扣掉最長的右側標籤「電機資訊學院」(6 字
// ×12 = 72)，只剩約 46 可用，超過文字就會被面板的 overflow-hidden 切掉。
const RUN = toUnits(40)
const DOT = toUnits(2.5)
// 同一側兩個標籤中心的最小距離。實測一個兩行標籤的外框高 35 設計 px（比
// 19+12 大，因為字框比 font-size 高），故留 40 才不會貼在一起。
const LABEL_PITCH = toUnits(40)

const INK = '#F6F6F6'
const PERIWINKLE = '#A5BDE2'

export default function StatsPieChart({
  chart,
  showLabels = false,
}: {
  chart: StatsChart
  showLabels?: boolean
}) {
  const { box, radius } = showLabels ? LABELLED : PLAIN
  const center = box / 2

  // 0 度 = 12 點鐘方向，順時針為正；SVG 的 0 度在 3 點鐘，故減 90。
  const polar = (angle: number, r: number) => {
    const rad = ((angle - 90) * Math.PI) / 180
    return { x: center + r * Math.cos(rad), y: center + r * Math.sin(rad) }
  }

  const total = chart.slices.reduce((sum, slice) => sum + slice.value, 0)
  const segments = chart.slices.reduce<
    { slice: StatsChart['slices'][number]; start: number; end: number }[]
  >((items, slice) => {
    const start = items.at(-1)?.end ?? chart.startAngle
    return [
      ...items,
      { slice, start, end: start + (slice.value / total) * 360 },
    ]
  }, [])

  // 相鄰的小切片中心角很接近，標籤會疊在一起（例如學校分佈的中央 2.9% 與成功
  // 5.0%）。設計稿是靠手動上下挪開解決的，這裡改成自動：同一側的標籤依 y 排序後
  // 撐開到最小間距，再從底部回推一次避免被推出畫布。引線第二段因此會變成斜的 ——
  // 設計稿本來就有這種兩段式折線。
  const labels = segments.map(({ slice, start, end }) => {
    const mid = (start + end) / 2
    const elbow = polar(mid, radius + ELBOW)
    return {
      slice,
      on: polar(mid, radius),
      elbow,
      right: elbow.x >= center,
      y: elbow.y,
    }
  })

  if (showLabels) {
    for (const side of [true, false]) {
      const group = labels
        .filter((l) => l.right === side)
        .sort((a, b) => a.y - b.y)
      for (let i = 1; i < group.length; i++) {
        group[i].y = Math.max(group[i].y, group[i - 1].y + LABEL_PITCH)
      }
      // 若被推超出下緣，從底部往回擠
      const limit = box - LABEL_PITCH / 2
      for (let i = group.length - 1; i >= 0; i--) {
        const cap =
          i === group.length - 1 ? limit : group[i + 1].y - LABEL_PITCH
        group[i].y = Math.min(group[i].y, cap)
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${box} ${box}`}
      role="img"
      aria-label={`${chart.title}：${chart.slices.map(({ label, value }) => `${label} ${value}%`).join('、')}`}
      className="block h-full w-full overflow-visible drop-shadow-[0_4px_8px_rgba(0,0,0,0.22)]"
    >
      <title>{chart.title}</title>

      {segments.map(({ slice, start, end }) => {
        const from = polar(start, radius)
        const to = polar(end, radius)
        const largeArc = end - start > 180 ? 1 : 0
        return (
          <path
            key={slice.label}
            d={`M ${center} ${center} L ${from.x} ${from.y} A ${radius} ${radius} 0 ${largeArc} 1 ${to.x} ${to.y} Z`}
            fill={slice.color}
          >
            <title>{`${slice.label} ${slice.value}%`}</title>
          </path>
        )
      })}

      {showLabels &&
        labels.map(({ slice, on, elbow, right, y }) => {
          const runEnd = elbow.x + (right ? RUN : -RUN)
          const textX = runEnd + (right ? DOT * 2 : -DOT * 2)
          return (
            <g key={slice.label}>
              <path
                d={`M ${on.x} ${on.y} L ${elbow.x} ${elbow.y} L ${runEnd} ${y}`}
                fill="none"
                stroke={INK}
                strokeWidth={toUnits(1)}
              />
              <circle cx={runEnd} cy={y} r={DOT} fill={INK} />
              <text
                x={textX}
                y={y - LABEL_GAP}
                fill={INK}
                fontSize={LABEL_SIZE}
                textAnchor={right ? 'start' : 'end'}
                dominantBaseline="middle"
                className="font-noto font-medium"
              >
                {slice.label}
              </text>
              <text
                x={textX}
                y={y + LABEL_GAP}
                fill={PERIWINKLE}
                fontSize={LABEL_SIZE}
                textAnchor={right ? 'start' : 'end'}
                dominantBaseline="middle"
                className="font-noto font-medium"
              >
                {slice.value.toFixed(1)}%
              </text>
            </g>
          )
        })}
    </svg>
  )
}
