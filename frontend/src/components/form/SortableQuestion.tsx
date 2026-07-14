import { useRef, useState } from 'react'
import QuestionTitle from './QuestionTitle'

interface SortableQuestionProps {
  title: string
  description?: string
  value: string[]
  onChange: (value: string[]) => void
}

const rankLabels = ['一', '二', '三', '四', '五', '六', '七']

// Drag-to-reorder list. Uses pointer events (not HTML5 drag) so it works
// identically with a mouse and with touch on every breakpoint; `touch-none`
// stops the page from scrolling while a row is being dragged.
export default function SortableQuestion({
  title,
  description,
  value,
  onChange,
}: SortableQuestionProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  const reorder = (from: number, to: number) => {
    if (from === to) return
    const next = [...value]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChange(next)
  }

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    index: number,
  ) => {
    setDragIndex(index)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragIndex === null) return
    const y = e.clientY
    // Target = first row whose vertical midpoint is below the pointer.
    let target = value.length - 1
    for (let i = 0; i < value.length; i++) {
      const el = itemsRef.current[i]
      if (!el) continue
      const rect = el.getBoundingClientRect()
      if (y < rect.top + rect.height / 2) {
        target = i
        break
      }
    }
    if (target !== dragIndex) {
      reorder(dragIndex, target)
      setDragIndex(target)
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragIndex !== null) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        // pointer already released — ignore
      }
    }
    setDragIndex(null)
  }

  return (
    <div className="py-4 md:py-8">
      <h3 className="text-sm leading-6 font-semibold text-white md:text-[1.5625rem] md:leading-10">
        <QuestionTitle title={title} />
      </h3>
      {description && (
        <p className="mx-4 mt-2 text-xs leading-snug whitespace-pre-line md:mt-3 md:text-xl md:leading-relaxed">
          {description}
        </p>
      )}
      <div className="mx-4 mt-3 flex flex-col gap-3 md:mt-5 md:gap-4">
        {value.map((option, index) => (
          <div key={option} className="flex items-center gap-3">
            <div className="rounded-lg px-2 py-1.5 text-sm font-bold whitespace-nowrap text-white md:px-3 md:py-2 md:text-xl">
              志願序{rankLabels[index]}
            </div>

            <div
              ref={(el) => {
                itemsRef.current[index] = el
              }}
              onPointerDown={(e) => handlePointerDown(e, index)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={`group relative flex flex-1 touch-none items-center rounded-md border-[0.1875rem] bg-[#D8D8D8] p-2 transition-all duration-200 select-none md:p-3 ${
                dragIndex === index
                  ? 'border-darkblue cursor-grabbing opacity-70 shadow-lg'
                  : 'cursor-grab border-[#B1A2CA] shadow-md hover:border-gray-400'
              }`}
            >
              <svg
                className="mr-3 h-3 w-3 shrink-0 text-gray-400 transition-colors group-hover:text-gray-600"
                fill="currentColor"
                viewBox="0 0 6 10"
              >
                <circle cx="1" cy="1" r="1" />
                <circle cx="1" cy="5" r="1" />
                <circle cx="1" cy="9" r="1" />
                <circle cx="5" cy="1" r="1" />
                <circle cx="5" cy="5" r="1" />
                <circle cx="5" cy="9" r="1" />
              </svg>
              <span className="text-darkblue text-sm md:text-xl">{option}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-4 mt-3 text-xs text-white/70">
        💡 拖拉項目來調整順序
      </div>
    </div>
  )
}
