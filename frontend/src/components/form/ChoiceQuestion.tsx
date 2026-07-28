import { useId } from 'react'
import QuestionHeader from './QuestionHeader'

interface ChoiceQuestionProps {
  title: string
  description?: string
  pdf?: string
  options: string[]
  value: string
  onChange: (value: string) => void
}

export default function ChoiceQuestion({
  title,
  description,
  pdf,
  options,
  value,
  onChange,
}: ChoiceQuestionProps) {
  const groupName = useId()

  return (
    <div className="py-2 whitespace-pre-line md:py-8">
      <QuestionHeader title={title} />
      {pdf && (
        <p className="mx-4 mt-1.5 text-[0.5rem] leading-snug text-white/80 md:mt-3 md:text-xl md:leading-relaxed">
          <a
            href={pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#B1A2CA] underline"
          >
            點我閱讀同意書
          </a>
          （在新分頁中開啟）
        </p>
      )}
      {description && (
        <p className="mx-4 mt-1.5 text-[0.5rem] leading-snug whitespace-pre-line text-white/80 md:mt-3 md:text-xl md:leading-relaxed">
          {description}
        </p>
      )}
      <div className="mx-4 mt-3 flex flex-wrap gap-x-8 gap-y-3 md:mt-5 md:gap-x-20 md:gap-y-6">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-2 md:gap-3"
          >
            <input
              type="radio"
              name={groupName}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="checked:border-darkblue h-5 w-5 cursor-pointer appearance-none rounded-full border-[0.1875rem] border-[#B1A2CA] bg-[#D8D8D8] checked:bg-[radial-gradient(circle,_#2d3e63_0%,_#2d3e63_50%,_transparent_55%)] md:h-11 md:w-11"
            />
            <span className="text-[0.5625rem] whitespace-nowrap text-white md:text-xl">
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
