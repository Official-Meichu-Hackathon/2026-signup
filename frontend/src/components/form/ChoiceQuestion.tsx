import { useId } from 'react'
import QuestionHeader from './QuestionHeader'

interface ChoiceQuestionProps {
  title: string
  description?: string
  pdf?: string
  image?: string
  imageAlt?: string
  options: string[]
  value: string
  onChange: (value: string) => void
}

export default function ChoiceQuestion({
  title,
  description,
  pdf,
  image,
  imageAlt = '',
  options,
  value,
  onChange,
}: ChoiceQuestionProps) {
  const groupName = useId()
  // Long lists (衣服尺寸) wrap: equal min width keeps the rows in columns.
  const dense = options.length > 5

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
        <p className="mx-4 mt-1.5 text-[0.5rem] leading-snug whitespace-pre-line text-white md:mt-3 md:text-xl md:leading-relaxed">
          {description}
        </p>
      )}
      {image && (
        <img
          src={image}
          alt={imageAlt}
          className="mx-[2%] mt-2 w-[96%] max-w-[36rem] rounded-md md:mt-5"
        />
      )}
      <div
        className={`mx-4 mt-3 flex flex-wrap gap-y-3 md:mt-5 md:gap-y-6 ${
          dense ? 'gap-x-3 md:gap-x-6' : 'gap-x-8 md:gap-x-20'
        }`}
      >
        {options.map((option) => (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-2 md:gap-3 ${
              dense ? 'min-w-[3rem] md:min-w-[6.5rem]' : ''
            }`}
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
