import { useCallback, useState } from 'react'
import QuestionHeader from './QuestionHeader'
import { stripEmoji } from '../../lib/validators'

interface TextQuestionProps {
  title: string
  description?: string
  value: string
  onChange: (value: string) => void
  validate?: (value: string) => boolean
  invalidMessage?: string
}

const EMOJI_MESSAGE = '此欄位不接受表情符號'

export default function TextQuestion({
  title,
  description,
  value,
  onChange,
  validate,
  invalidMessage = '你的輸入格式錯誤',
}: TextQuestionProps) {
  const [showError, setShowError] = useState(false)
  const [emojiRejected, setEmojiRejected] = useState(false)

  const check = (current: string) => {
    if (!current || !validate) return true
    return validate(current)
  }

  // React's onBeforeInput is a synthetic polyfill whose preventDefault never
  // reaches the native event, so bind the real one.
  const bindEmojiGuard = useCallback((el: HTMLInputElement | null) => {
    if (!el) return
    const reject = (e: InputEvent) => {
      if (e.data && stripEmoji(e.data) !== e.data) {
        e.preventDefault()
        setEmojiRejected(true)
      }
    }
    el.addEventListener('beforeinput', reject)
    return () => el.removeEventListener('beforeinput', reject)
  }, [])

  return (
    <div className="py-2 md:py-8">
      <QuestionHeader title={title} description={description} />
      <input
        type="text"
        ref={bindEmojiGuard}
        value={value}
        onChange={(e) => {
          // Only reachable via IME composition, which beforeinput cannot cancel.
          const next = stripEmoji(e.target.value)
          setEmojiRejected(next !== e.target.value)
          onChange(next)
          if (showError && check(next)) setShowError(false)
        }}
        onBlur={() => setShowError(!check(value))}
        className="text-darkblue placeholder-darkblue/40 focus:border-darkblue mx-[2%] mt-2 w-[96%] rounded-md border-[0.1875rem] border-[#B1A2CA] bg-[#D8D8D8] p-1.5 text-[0.625rem] font-normal focus:outline-none md:mt-5 md:p-3 md:text-xl"
      />
      {(emojiRejected || showError) && (
        <p className="mx-4 mt-1.5 text-[0.5rem] text-red-400 md:text-sm">
          {emojiRejected ? EMOJI_MESSAGE : invalidMessage}
        </p>
      )}
    </div>
  )
}
