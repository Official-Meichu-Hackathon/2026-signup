import { PLAYER_ORDER_LABELS } from '../../lib/types'

interface PlayerTabsProps {
  playerCount: number // 3–5
  activeIndex: number // 0-based current player (currentStep - 2)
  onSelect: (index: number) => void
}

// Participant tab strip on top of the card during the 基本資料 stage. Active tab
// is taller; navigation is backward-only.
export default function PlayerTabs({
  playerCount,
  activeIndex,
  onSelect,
}: PlayerTabsProps) {
  return (
    <nav
      aria-label="參賽者"
      // Pulled up by the active tab's height so its bottom edge meets the card
      // top; the tabs protrude above the card body.
      className="relative z-20 -mt-12 flex items-end gap-0 md:-mt-[6.5rem]"
    >
      {Array.from({ length: playerCount }, (_, index) => {
        const isActive = index === activeIndex
        const isReachable = index <= activeIndex
        const label = `參賽者${PLAYER_ORDER_LABELS[index]}`
        return (
          <button
            key={index}
            type="button"
            aria-label={label}
            aria-current={isActive ? 'step' : undefined}
            disabled={!isReachable}
            onClick={() => isReachable && onSelect(index)}
            // Glass tab, rounded top only so it merges into the card. Flush
            // stacking; active is taller with a brighter fill.
            className={`relative flex items-center justify-center overflow-hidden rounded-t-2xl border border-b-0 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-200 md:rounded-t-[3.4375rem] ${
              index > 0 ? '-ml-px' : ''
            } ${
              isActive
                ? 'z-20 h-12 border-b-0 border-white/25 bg-black/30 px-3 shadow-[inset_0_1px_8px_rgba(255,255,255,0.3),0_0_28px_rgba(120,150,255,0.2)] md:h-[6.5rem] md:px-9'
                : `z-10 h-9 border-white/15 bg-black/45 px-2.5 shadow-[inset_0_1px_8px_rgba(255,255,255,0.18)] md:h-[4.5rem] md:px-8 ${
                    isReachable ? 'cursor-pointer' : 'cursor-default'
                  }`
            }`}
          >
            {/* Sheen overlay (pointer-events-none). */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-t-2xl bg-gradient-to-b from-white/15 to-transparent md:rounded-t-[3.4375rem]"
            />
            <span
              className={`relative z-10 font-bold whitespace-nowrap text-white md:text-2xl ${
                isActive ? 'text-xs' : 'text-xs text-white/85'
              }`}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
