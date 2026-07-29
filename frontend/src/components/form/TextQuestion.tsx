import { useState } from 'react'
import QuestionHeader from './QuestionHeader'

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
    <div className="py-2 md:py-8">
      <QuestionHeader title={title} description={description} />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          if (showError && check(e.target.value)) setShowError(false)
        }}
        onBlur={() => setShowError(!check(value))}
        className="text-darkblue placeholder-darkblue/40 focus:border-darkblue mx-[2%] mt-2 w-[96%] rounded-md border-[0.1875rem] border-[#B1A2CA] bg-[#D8D8D8] p-1.5 text-[0.625rem] font-normal focus:outline-none md:mt-5 md:p-3 md:text-xl"
      />
      {showError && (
        <p className="mx-4 mt-1.5 text-[0.5rem] text-red-400 md:text-sm">
          {invalidMessage}
        </p>
      )}
    </div>
  )
}
