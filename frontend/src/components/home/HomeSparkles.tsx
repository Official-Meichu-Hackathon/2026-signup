import sparkleField1 from '../../assets/home/sparkle-field-1.svg'
import sparkleField2 from '../../assets/home/sparkle-field-2.svg'
import sparkleField3 from '../../assets/home/sparkle-field-3.svg'
import sparkleField4 from '../../assets/home/sparkle-field-4.svg'
import sparkleField5 from '../../assets/home/sparkle-field-5.svg'
import sparkleGroupEdge from '../../assets/home/sparkle-group-edge.svg'
import sparkleGroupLarge from '../../assets/home/sparkle-group-large.svg'
import sparkleGroupSmall from '../../assets/home/sparkle-group-small.svg'
import sparkleLoading from '../../assets/home/sparkle-loading.svg'
import sparkleSource from '../../assets/home/sparkle-source.svg'

export function LoadingSparkles({ className = '' }: { className?: string }) {
  return (
    <img src={sparkleLoading} alt="" aria-hidden="true" className={className} />
  )
}

export function FigmaSparkle({ className = '' }: { className?: string }) {
  return (
    <img src={sparkleSource} alt="" aria-hidden="true" className={className} />
  )
}

function DecorativeStar({
  src,
  className,
}: {
  src: string
  className: string
}) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={`home-figma-sparkle ${className}`}
    />
  )
}

export function GroupTitleSparkles() {
  return (
    <div className="group-title-sparkles" aria-hidden="true">
      <DecorativeStar
        src={sparkleGroupLarge}
        className="group-title-sparkle-large"
      />
      <DecorativeStar
        src={sparkleGroupSmall}
        className="group-title-sparkle-small"
      />
      <DecorativeStar
        src={sparkleGroupEdge}
        className="group-title-sparkle-edge"
      />
    </div>
  )
}

export function AwardsSparkleField() {
  return (
    <div className="awards-sparkle-canvas" aria-hidden="true">
      <div className="awards-sparkle-field">
        <DecorativeStar src={sparkleField1} className="awards-sparkle-1" />
        <DecorativeStar src={sparkleField3} className="awards-sparkle-2" />
        <DecorativeStar src={sparkleField2} className="awards-sparkle-3" />
        <DecorativeStar src={sparkleField4} className="awards-sparkle-4" />
        <DecorativeStar src={sparkleField5} className="awards-sparkle-5" />
      </div>
    </div>
  )
}
