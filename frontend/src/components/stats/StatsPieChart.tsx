import type { StatsChart } from './statsData'

// Matches the statistics-card palette from the design: ink navy, muted blue,
// and soft lavender, with tonal extensions for charts with more categories.
const COLORS = [
  '#4d6bb1',
  '#2d3e63',
  '#b2a2cc',
  '#7187bb',
  '#52678f',
  '#cbc2df',
  '#1f2d4e',
]
const CENTER = 50
// The surrounding SVG canvas intentionally leaves room for the existing
// desktop and mobile panel layout; the pie itself occupies its centered half.
const RADIUS = 25

const polarPoint = (angle: number) => {
  const radians = ((angle - 90) * Math.PI) / 180
  return {
    x: CENTER + RADIUS * Math.cos(radians),
    y: CENTER + RADIUS * Math.sin(radians),
  }
}

const slicePath = (start: number, end: number) => {
  const from = polarPoint(start)
  const to = polarPoint(end)
  const largeArc = end - start > 180 ? 1 : 0
  return `M ${CENTER} ${CENTER} L ${from.x} ${from.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${to.x} ${to.y} Z`
}

export default function StatsPieChart({ chart }: { chart: StatsChart }) {
  const total = chart.slices.reduce((sum, slice) => sum + slice.value, 0)
  const segments = chart.slices.reduce<
    {
      slice: StatsChart['slices'][number]
      start: number
      end: number
    }[]
  >((items, slice) => {
    const start = items.at(-1)?.end ?? 0
    const end = start + (slice.value / total) * 360
    return [...items, { slice, start, end }]
  }, [])

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={`${chart.title}：${chart.slices.map(({ label, value }) => `${label} ${value}%`).join('、')}`}
      className="block h-full w-full overflow-visible drop-shadow-[0_4px_8px_rgba(0,0,0,0.22)]"
    >
      <title>{chart.title}</title>
      {segments.map(({ slice, start, end }, index) => {
        const path = slicePath(start, end)

        return (
          <path key={slice.label} d={path} fill={COLORS[index % COLORS.length]}>
            <title>{`${slice.label} ${slice.value}%`}</title>
          </path>
        )
      })}
    </svg>
  )
}
