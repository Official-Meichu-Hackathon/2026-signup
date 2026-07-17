import type { ReactNode } from 'react'

// Controlled accordion, same contract as the 2025 ExpandableItem.vue
// (parent owns `expanded` so only one item is open at a time).
// Motion notes: asymmetric timing (open 500ms, close 350ms) with a strong
// ease-out; the +/− icon morphs by collapsing the vertical bar.
interface ExpandableItemProps {
  title: string
  expanded: boolean
  onToggle: () => void
  children: ReactNode
}

export default function ExpandableItem({
  title,
  expanded,
  onToggle,
  children,
}: ExpandableItemProps) {
  return (
    <div className="border-b border-white/60 pb-5">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left text-xl font-bold text-white transition-opacity duration-150 hover:opacity-80 md:text-2xl"
        aria-expanded={expanded}
      >
        <span>{title}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="h-7 w-7 shrink-0"
        >
          <path
            d="M12 1v22"
            className={`transition-transform duration-300 ease-(--ease-out-strong) ${
              expanded ? 'scale-y-0' : 'scale-y-100'
            }`}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          />
          <path d="M1 12h22" />
        </svg>
      </button>
      <div
        className={`grid transition-[grid-template-rows] ease-(--ease-out-strong) ${
          expanded
            ? 'grid-rows-[1fr] duration-500'
            : 'grid-rows-[0fr] duration-[350ms]'
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`pt-5 pl-2 leading-relaxed text-white/90 transition-[opacity,transform] ease-(--ease-out-strong) md:pl-6 ${
              expanded
                ? 'translate-y-0 opacity-100 duration-500'
                : '-translate-y-2 opacity-0 duration-[350ms]'
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
