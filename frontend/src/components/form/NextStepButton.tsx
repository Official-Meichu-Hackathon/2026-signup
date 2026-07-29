import { useState } from 'react'

interface NextStepButtonProps {
  disabled: boolean
  isLastStep: boolean
  isSubmitting: boolean
  onClick: () => void
  // Revealed when the disabled button is tapped.
  disabledHint?: string
}

export default function NextStepButton({
  disabled,
  isLastStep,
  isSubmitting,
  onClick,
  disabledHint,
}: NextStepButtonProps) {
  const [showHint, setShowHint] = useState(false)
  // A disabled button swallows clicks, so gate in the handler instead.
  const isBlocked = disabled && !!disabledHint

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 pt-4 md:pt-6">
      <button
        type="button"
        onClick={() => (isBlocked ? setShowHint(true) : onClick())}
        aria-disabled={disabled}
        disabled={disabled && !isBlocked}
        className={`flex items-center justify-center rounded-full border px-6 py-2.5 text-[0.625rem] font-black text-white backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 select-none md:px-16 md:py-4 md:text-lg ${
          disabled
            ? 'cursor-not-allowed border-white/15 bg-white/[0.05] text-white/40'
            : 'cursor-pointer border-white/30 bg-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_0_20px_rgba(255,255,255,0.06)] hover:scale-105 hover:bg-white/[0.18]'
        }`}
      >
        {isSubmitting && isLastStep && (
          <span className="mr-4 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        )}
        {isSubmitting && isLastStep
          ? '送出中...'
          : isLastStep
            ? 'FINISH'
            : 'NEXT'}
      </button>
      {isBlocked && showHint && (
        <p
          role="status"
          className="text-center text-[0.625rem] font-bold text-[#FF8A8A] md:text-base"
        >
          {disabledHint}
        </p>
      )}
    </div>
  )
}
