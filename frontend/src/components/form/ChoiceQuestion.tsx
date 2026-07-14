import { useId } from 'react'
import QuestionTitle from './QuestionTitle'

interface ChoiceQuestionProps {
  title: string
  description?: string
  pdf?: string
  referenceLink?: string
  referenceLinkText?: string
  options: string[]
  value: string
  onChange: (value: string) => void
}

export default function ChoiceQuestion({
  title,
  description,
  pdf,
  referenceLink,
  referenceLinkText = '參考連結',
  options,
  value,
  onChange,
}: ChoiceQuestionProps) {
  const groupName = useId()

  return (
    <div className="py-4 whitespace-pre-line md:py-8">
      <h3 className="text-sm leading-6 font-semibold text-white md:text-[1.5625rem] md:leading-10">
        <QuestionTitle title={title} />
      </h3>
      {pdf && (
        <>
          <iframe
            src={`https://drive.google.com/file/d/${pdf}/preview`}
            className="my-5 h-[60vh] w-full"
            allow="autoplay"
            title={title}
          />
          <p className="mx-4 mt-2 text-white/80">
            若pdf無法正確內嵌顯示，你可以{' '}
            <a
              href={`https://drive.google.com/file/d/${pdf}/view`}
              className="text-lightblue hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              點擊我下載
            </a>
            （在新分頁中開啟）
          </p>
        </>
      )}
      {description && (
        <p className="mx-4 mt-2 text-xs leading-snug whitespace-pre-line text-white/80 md:mt-3 md:text-xl md:leading-relaxed">
          {description}
        </p>
      )}
      {referenceLink && (
        <p className="mx-4 mt-2 text-white/80">
          <a
            href={referenceLink}
            className="text-lightblue hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {referenceLinkText}
          </a>
          （在新分頁中開啟）
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
            <span className="text-sm whitespace-nowrap text-white md:text-xl">
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
