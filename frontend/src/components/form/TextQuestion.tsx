import { useState } from 'react'
import QuestionTitle from './QuestionTitle'

interface TextQuestionProps {
  title: string
  description?: string
  value: string
  onChange: (value: string) => void
  validate?: (value: string) => boolean
  invalidMessage?: string
}

export default function TextQuestion({
  title,
  description,
  value,
  onChange,
  validate,
  invalidMessage = '你的輸入格式錯誤',
}: TextQuestionProps) {
  const [showError, setShowError] = useState(false)

  const check = (current: string) => {
    if (!current || !validate) return true
    return validate(current)
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
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          if (showError && check(e.target.value)) setShowError(false)
        }}
        onBlur={() => setShowError(!check(value))}
        className="text-darkblue placeholder-darkblue/40 focus:border-darkblue mx-[2%] mt-3 w-[96%] rounded-md border-[0.1875rem] border-[#B1A2CA] bg-[#D8D8D8] p-2 text-sm font-normal focus:outline-none md:mt-5 md:p-3 md:text-xl"
      />
      {showError && (
        <p className="mx-4 mt-2 text-sm text-red-400">{invalidMessage}</p>
      )}
    </div>
  )
}
