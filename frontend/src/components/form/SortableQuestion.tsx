import { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import QuestionHeader from './QuestionHeader'

interface SortableQuestionProps {
  title: string
  description?: string
  value: string[]
  onChange: (value: string[]) => void
}

const rankLabels = ['一', '二', '三', '四', '五', '六', '七', '八']

// Six-dot grab handle, shared by the in-list rows and the DragOverlay clone.
function DragHandle({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`mr-3 h-3 w-3 shrink-0 text-gray-400 transition-colors group-hover:text-gray-600 ${className}`}
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
  )
}

// One sortable row. The whole card is draggable (attributes + listeners on the
// card) to match the previous behaviour. `useSortable` gives us the live-slide
// transform for non-dragged rows and the `isDragging` flag for the origin
// placeholder. Hooks can't be looped in the parent, hence a subcomponent.
function SortableRow({ option, index }: { option: string; index: number }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: option })

  return (
    <div className="flex items-center gap-3">
      <div className="rounded-lg px-2 py-1.5 text-sm font-bold whitespace-nowrap text-white md:px-3 md:py-2 md:text-xl">
        志願序{rankLabels[index]}
      </div>

      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        className={`group relative flex flex-1 touch-none items-center rounded-md border-[0.1875rem] bg-[#D8D8D8] p-2 transition-all duration-200 ease-(--ease-out-strong) select-none md:p-3 ${
          isDragging
            ? // Origin placeholder: dashed gap that keeps the same border width
              // so the row swap causes zero layout shift. The visible copy is
              // the DragOverlay, so this row's content is hidden with opacity-0.
              'border-darkblue border-dashed bg-[#D8D8D8]/30 shadow-none'
            : 'cursor-grab border-[#B1A2CA] shadow-md hover:border-gray-400'
        }`}
      >
        <DragHandle className={isDragging ? 'opacity-0' : ''} />
        <span
          className={`text-darkblue text-sm md:text-xl ${
            isDragging ? 'opacity-0' : ''
          }`}
        >
          {option}
        </span>
      </div>
    </div>
  )
}

// Drag-to-reorder list built on @dnd-kit. The PointerSensor's 8px activation
// distance lets vertical page scroll and taps pass through untouched, while a
// deliberate drag still engages; `touch-none` on the card keeps the browser
// from hijacking the gesture once dragging starts. The KeyboardSensor adds
// arrow-key reordering for accessibility.
//
// The rank badges are index-fixed siblings outside the sortable card, so
// 志願序一 always sits at position 1 — only the card content reorders.
export default function SortableQuestion({
  title,
  description,
  value,
  onChange,
}: SortableQuestionProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const from = value.indexOf(active.id as string)
      const to = value.indexOf(over.id as string)
      if (from !== -1 && to !== -1) {
        onChange(arrayMove(value, from, to))
      }
    }
    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  return (
    <div className="py-4 md:py-8">
      <QuestionHeader title={title} description={description} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={value} strategy={verticalListSortingStrategy}>
          <div className="mx-4 mt-3 flex flex-col gap-3 md:mt-5 md:gap-4">
            {value.map((option, index) => (
              <SortableRow key={option} option={option} index={index} />
            ))}
          </div>
        </SortableContext>

        {/* Lifted floating clone of the dragged row. FormStep's ancestor uses
            backdrop-blur + overflow-hidden, which clips fixed/absolute
            descendants, so the overlay is portalled to <body> to escape the
            clip. */}
        {createPortal(
          <DragOverlay>
            {activeId ? (
              <div className="group border-darkblue flex items-center rounded-md border-[0.1875rem] bg-white p-2 shadow-2xl md:p-3">
                <DragHandle />
                <span className="text-darkblue text-sm md:text-xl">
                  {activeId}
                </span>
              </div>
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>

      <div className="mx-4 mt-3 text-xs text-white/70">
        💡 拖拉項目來調整順序
      </div>
    </div>
  )
}
