import sparkleBright from '../../assets/home/sparkle-bright.svg'
import sparkleSoft from '../../assets/home/sparkle-soft.svg'

export default function Sparkle({
  variant = 'bright',
  className = '',
}: {
  variant?: 'bright' | 'soft'
  className?: string
}) {
  return (
    <img
      src={variant === 'bright' ? sparkleBright : sparkleSoft}
      alt=""
      aria-hidden
      className={`pointer-events-none absolute select-none ${className}`}
    />
  )
}
