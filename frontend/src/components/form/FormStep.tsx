import { useEffect, useRef, type ReactNode } from 'react'
import NextStepButton from './NextStepButton'

interface FormStepProps {
  stepOrder: number
  totalSteps: number
  stepName: string
  currentStep: number
  requiredOk: boolean
  isSubmitting: boolean
  onStepChange: (step: number) => void
  onSubmit: () => void
  children: ReactNode
}

// Card corner radii, shared by the card and its sheen overlay. Kept as whole
// literal tokens so Tailwind JIT emits them.
const MOBILE_ROUNDED =
  'rounded-tl-none rounded-tr-[42.734px] rounded-br-[42.734px] rounded-bl-[42.734px]'
const MD_ROUNDED =
  'md:rounded-tr-[9.8125rem] md:rounded-br-[9.8125rem] md:rounded-bl-[9.8125rem]'

export default function FormStep({
  stepOrder,
  totalSteps,
  stepName,
  currentStep,
  requiredOk,
  isSubmitting,
  onStepChange,
  onSubmit,
  children,
}: FormStepProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isActive = stepOrder === currentStep
  const isLastStep = stepOrder === totalSteps

  useEffect(() => {
    if (isActive && stepOrder > 1) {
      containerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [isActive, stepOrder])

  const handleNext = () => {
    if (isLastStep) {
      onSubmit()
      return
    }
    onStepChange(stepOrder + 1)
  }

  // Inactive steps are hidden entirely; the rail handles backward navigation.
  if (!isActive) return null

  return (
    <div ref={containerRef} className="scroll-mt-28 pb-5">
      {/* Glass card: square top-left (meets the rail), rounded elsewhere.
          Mobile follows the Figma glass spec; md: restores the desktop look. */}
      <div
        className={`relative overflow-hidden ${MOBILE_ROUNDED} border-[0.272px] border-[rgba(255,255,255,0.2)] bg-[linear-gradient(167deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.03)_99.06%)] px-5 py-8 font-bold text-white shadow-[0_2.722px_8.166px_0_rgba(0,0,0,0.25),inset_0_0.272px_2.178px_0_rgba(255,255,255,0.5)] backdrop-blur-[9.527px] ${MD_ROUNDED} md:border md:border-white/20 md:bg-[linear-gradient(167deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.03)_99.06%)] md:px-24 md:py-20 md:shadow-[0_10px_30px_0_rgba(0,0,0,0.25),inset_0_1px_8px_0_rgba(255,255,255,0.5)] md:backdrop-blur-[35px]`}
      >
        {/* Sheen overlay (pointer-events-none). */}
        <div
          className={`pointer-events-none absolute inset-0 ${MOBILE_ROUNDED} bg-gradient-to-b from-white/[0.08] to-transparent ${MD_ROUNDED}`}
        />
        <div className="relative z-10">
          <div className="flex items-center pb-4 md:pb-8">
            <div className="mr-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white ring-1 ring-white/40 md:mr-4 md:h-11 md:w-11 md:text-base">
              <span className="font-zen">{stepOrder}</span>
            </div>
            <p className="text-base text-white md:text-3xl">{stepName}</p>
          </div>
          {children}
          <NextStepButton
            onClick={handleNext}
            disabled={!requiredOk || isSubmitting}
            isLastStep={isLastStep}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  )
}
