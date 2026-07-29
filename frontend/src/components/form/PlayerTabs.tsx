import { PLAYER_ORDER_LABELS } from '../../lib/types'

interface PlayerTabsProps {
  playerCount: number // 3–5
  activeIndex: number // 0-based current player (currentStep - 2)
  onSelect: (index: number) => void
}

// Participant tab strip on top of the card during the 基本資料 stage. Active tab
// is taller; any tab is selectable in either direction.

export default function PlayerTabs({
  playerCount,
  activeIndex,
  onSelect,
}: PlayerTabsProps) {
  return (
    <nav
      aria-label="參賽者"
      // Pulled up by the active tab's height so its bottom edge meets the card
      // top; the tabs protrude above the card body. Tabs keep their natural
      // width and the strip is budgeted to 75% of the card — the fluid label
      // size below is derived from that share.
      // Height pinned to the active tab's so tab transitions don't shift the card.
      className="relative z-20 -mt-9 flex h-9 max-w-[75%] items-end gap-0 md:-mt-[4.875rem] md:h-[4.875rem]"
    >
      {Array.from({ length: playerCount }, (_, index) => {
        const isActive = index === activeIndex
        const label = `參賽者${PLAYER_ORDER_LABELS[index]}`
        return (
          <button
            key={index}
            type="button"
            aria-label={label}
            aria-current={isActive ? 'step' : undefined}
            onClick={() => onSelect(index)}
            // Glass tab, rounded top only so it merges into the card. Flush
            // stacking; active is taller with a brighter fill. Padding is on
            // the base class so both states stay the same width.
            className={`relative flex items-center justify-center overflow-hidden rounded-t-xl border border-b-0 px-1.5 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-200 md:rounded-t-[2.5rem] md:px-4 ${
              index > 0 ? '-ml-px' : ''
            } ${
              isActive
                ? 'z-20 h-9 border-white/25 bg-black/30 shadow-[inset_0_1px_8px_rgba(255,255,255,0.3),0_0_28px_rgba(120,150,255,0.2)] md:h-[4.875rem]'
                : 'z-10 h-7 cursor-pointer border-white/15 bg-black/45 shadow-[inset_0_1px_8px_rgba(255,255,255,0.18)] md:h-[3.5rem]'
            }`}
          >
            {/* Sheen overlay (pointer-events-none). */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-t-xl bg-gradient-to-b from-white/15 to-transparent md:rounded-t-[2.5rem]"
            />
            {/* Fluid rather than truncated, so all 5 labels stay whole: at 15%
                of the card per tab, 4 characters plus padding leave
                3.75vw - 5.625px each. */}
            <span
              className={`relative z-10 text-[clamp(6px,calc(3.75vw_-_5.625px),10px)] font-bold whitespace-nowrap text-white md:text-xl ${
                isActive ? '' : 'text-white/85'
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
