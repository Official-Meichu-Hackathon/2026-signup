import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import groupHacker from '../../assets/home/group-hacker.webp'
import groupMaker from '../../assets/home/group-maker.webp'
import workshopDetailHacker from '../../assets/home/workshop-detail-1-update.png'
import workshopDetailMaker from '../../assets/home/workshop-detail-2.png'
import { GroupTitleSparkles } from './HomeSparkles'

type GroupKey = 'hacker' | 'maker'

const TABS: { key: GroupKey; label: string }[] = [
  { key: 'hacker', label: '黑客組' },
  { key: 'maker', label: '創客組' },
]

const CONTENT: Record<
  GroupKey,
  {
    image: string
    intro: string
    workshop: string
    workshopDetail: string
    workshopDetailAlt: string
  }
> = {
  hacker: {
    image: groupHacker,
    intro:
      '致力於搭起學界與業界之間的橋樑，參賽者將運用企業資源並發揮創意回應企業命題，讓想像力與實作並存！2026 年梅竹黑客松將由以下七家企業作為引導單位：CloudMosa、羅技、AMD、聚陽實業、NXP、愛德萬測試、Google。',
    workshop:
      '每間合作企業皆會舉辦工作坊，透過工作坊，參賽者將領取到企業所提供的硬體設備或軟體資源，並且由企業之技術人員親自教學，簡易的指導參賽者如何使用相關技術或資源。舉辦地點與時間將依不同企業而定。',
    workshopDetail: workshopDetailHacker,
    workshopDetailAlt: '黑客組賽前工作坊詳細資訊',
  },
  maker: {
    image: groupMaker,
    intro:
      '由新竹市政府命題，鼓勵參賽者運用 AI、大數據、物聯網等科技，針對市政服務提出創新解方，從智慧交通、公共安全到環境監測，打造更即時、便利、貼近市民需求的智慧應用，共創友善高效的未來城市。',
    workshop:
      '由市府團隊主辦，工作坊將包含技術教學、題目講解等內容，並包含參賽團隊選題之流程。過程中參賽者將與講師討論應用技術，共同激盪出更多的靈感與創意。',
    workshopDetail: workshopDetailMaker,
    workshopDetailAlt: '創客交流組賽前工作坊詳細資訊',
  },
}

const GROUP_CARD_IMAGES = Object.values(CONTENT).map(({ image }) => image)

function GlassCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-tl-[5px] rounded-tr-[80px] rounded-br-[80px] rounded-bl-[80px] bg-white/20 shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] backdrop-blur-[35px] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_1px_8px_0px_rgba(255,255,255,0.5)]" />
      {children}
    </div>
  )
}

function WorkshopDetailModal({
  image,
  alt,
  onClose,
}: {
  image: string
  alt: string
  onClose: () => void
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow
    const originalRootOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (
        [
          ' ',
          'ArrowUp',
          'ArrowDown',
          'PageUp',
          'PageDown',
          'Home',
          'End',
        ].includes(event.key)
      ) {
        event.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalRootOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return createPortal(
    <div
      className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/65 p-4 backdrop-blur-sm md:p-8"
      style={{ touchAction: 'pinch-zoom' }}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="關閉工作坊詳細資訊"
        className="font-noto fixed top-4 right-4 z-10 flex size-11 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[42px] leading-none font-light text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-opacity outline-none hover:opacity-65 md:top-8 md:right-8"
      >
        <span aria-hidden="true" className="-translate-y-px">
          ×
        </span>
      </button>

      <div
        role="dialog"
        aria-modal="true"
        aria-label={alt}
        className="relative mx-auto flex max-h-[calc(100dvh-32px)] w-fit max-w-full items-center justify-center rounded-[clamp(20px,3vw,36px)] border border-white/30 bg-white/[0.14] p-[clamp(10px,1.7vw,22px)] shadow-[0_20px_70px_rgba(0,0,0,0.55),inset_0_1px_10px_rgba(255,255,255,0.35)] backdrop-blur-[28px] md:max-h-[92dvh] md:max-w-[min(92vw,760px)]"
      >
        <img
          src={image}
          alt={alt}
          className="block h-auto max-h-[calc(100dvh-52px)] max-w-full rounded-[clamp(12px,2vw,24px)] object-contain md:max-h-[calc(92dvh-44px)]"
        />
      </div>
    </div>,
    document.body,
  )
}

export default function GroupIntro() {
  const [tab, setTab] = useState<GroupKey>('hacker')
  const [isWorkshopDetailOpen, setIsWorkshopDetailOpen] = useState(false)
  const workshopTriggerRef = useRef<HTMLButtonElement | null>(null)
  const { image, intro, workshop, workshopDetail, workshopDetailAlt } =
    CONTENT[tab]

  useEffect(() => {
    GROUP_CARD_IMAGES.forEach((src) => {
      const preloadImage = new Image()
      preloadImage.src = src
      void preloadImage.decode().catch(() => undefined)
    })
  }, [])

  const openWorkshopDetail = (event: React.MouseEvent<HTMLButtonElement>) => {
    workshopTriggerRef.current = event.currentTarget
    setIsWorkshopDetailOpen(true)
  }

  const closeWorkshopDetail = () => {
    setIsWorkshopDetailOpen(false)
    window.requestAnimationFrame(() => workshopTriggerRef.current?.focus())
  }

  return (
    <div id="group-intro">
      <div className="group-intro-mobile">
        <p className="mobile-home-title">組別介紹</p>
        <div className="group-mobile-panel">
          <div className="group-mobile-tabs">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={tab === key ? 'is-active' : ''}
              >
                {label === '創客組' ? '創客交流組' : label}
              </button>
            ))}
          </div>
          <div className="group-mobile-card">
            <img src={image} alt="" loading="eager" decoding="async" />
            <div className="group-mobile-copy">
              <p>{intro}</p>
              <p>{workshop}</p>
            </div>
            <button
              type="button"
              onClick={openWorkshopDetail}
              aria-haspopup="dialog"
              className="group-mobile-workshop cursor-pointer"
            >
              工作坊資訊
            </button>
          </div>
        </div>
      </div>

      <div className="group-intro-desktop relative mx-auto min-h-[1024px] w-full max-w-[1440px] flex-col">
        <GroupTitleSparkles />
        <div className="absolute top-[155px] left-1/2 -translate-x-1/2">
          <p className="text-center font-['Zen_Antique'] text-[35px] leading-[44px] text-[#f6f6f6] [text-shadow:0px_0px_20px_rgba(255,255,255,0.35),0px_4px_40px_rgba(255,255,255,0.2)]">
            組別介紹
          </p>
        </div>

        <div className="flex w-full items-start gap-[clamp(48px,10.49vw,151px)] pt-[244px] pr-[clamp(24px,5vw,72px)]">
          <div className="group-edge-tabs flex w-[112px] shrink-0 flex-col items-start">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`font-noto relative flex cursor-pointer items-center justify-center rounded-r-[65px] border border-white/20 bg-gradient-to-br px-[43px] py-[29px] text-center text-[25px] leading-[40px] font-semibold text-white shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] backdrop-blur-[35px] transition-all duration-300 ease-out ${
                  tab === key
                    ? 'z-10 w-[150px] from-white/[0.14] to-white/[0.028] opacity-100'
                    : 'z-0 w-[112px] from-white/[0.14] to-white/[0.028] opacity-60 hover:opacity-75'
                }`}
              >
                <span className="w-[40px]">{label}</span>
                <span className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_1px_8px_0px_rgba(255,255,255,0.5)]" />
              </button>
            ))}
          </div>

          <div className="flex max-w-[1008px] min-w-0 flex-1 flex-col gap-[45px] pt-[45px] pb-[84px]">
            <div className="flex w-full items-start gap-[15px]">
              <p className="font-noto w-[26px] shrink-0 text-center text-[25px] leading-[40px] font-semibold text-white">
                組別介紹
              </p>
              <GlassCard className="grid h-[clamp(334px,14vw,350px)] min-w-0 flex-1">
                {TABS.map(({ key }) => {
                  const panel = CONTENT[key]
                  const active = tab === key

                  return (
                    <div
                      key={key}
                      aria-hidden={!active}
                      className={`flex w-full items-center gap-[clamp(16px,3.75vw,54px)] px-[clamp(20px,4vw,57px)] py-[clamp(32px,5vw,72px)] transition-[opacity,filter,transform] duration-[300ms] ease-out [grid-area:1/1] motion-reduce:transform-none motion-reduce:transition-none ${
                        active
                          ? 'blur-0 relative z-10 translate-y-0 scale-100 opacity-100 delay-[45ms]'
                          : 'pointer-events-none relative z-0 translate-y-1 scale-[0.99] opacity-0 blur-[5px] delay-0'
                      }`}
                    >
                      <img
                        src={panel.image}
                        alt=""
                        loading="eager"
                        decoding="async"
                        className="h-[clamp(160px,14.44vw,208px)] w-[clamp(200px,50%,340px)] shrink-0 rounded-[clamp(28px,2.85vw,41px)] object-cover"
                      />
                      <p className="font-noto min-w-0 flex-1 text-[clamp(14px,1.389vw,20px)] leading-[clamp(22px,2.222vw,32px)] font-semibold text-white">
                        {panel.intro}
                      </p>
                    </div>
                  )
                })}
              </GlassCard>
            </div>

            <div className="flex w-full items-start gap-[15px]">
              <p className="font-noto w-[26px] shrink-0 text-center text-[25px] leading-[40px] font-semibold text-white">
                工作坊
              </p>
              <GlassCard className="grid h-[clamp(334px,14vw,350px)] min-w-0 flex-1">
                {TABS.map(({ key }) => {
                  const panel = CONTENT[key]
                  const active = tab === key

                  return (
                    <div
                      key={key}
                      aria-hidden={!active}
                      className={`flex w-full items-center px-[clamp(20px,3.4vw,49px)] py-[clamp(32px,4.375vw,63px)] transition-[opacity,filter,transform] duration-[300ms] ease-out [grid-area:1/1] motion-reduce:transform-none motion-reduce:transition-none ${
                        active
                          ? 'blur-0 relative z-10 translate-y-0 scale-100 opacity-100 delay-[45ms]'
                          : 'pointer-events-none relative z-0 translate-y-1 scale-[0.99] opacity-0 blur-[5px] delay-0'
                      }`}
                    >
                      <div className="flex w-full max-w-[817px] min-w-0 flex-col items-start gap-[clamp(24px,3.125vw,45px)]">
                        <p className="font-noto text-[clamp(14px,1.389vw,20px)] leading-[clamp(22px,2.222vw,32px)] font-semibold text-white">
                          {panel.workshop}
                        </p>
                        <button
                          type="button"
                          tabIndex={active ? 0 : -1}
                          onClick={openWorkshopDetail}
                          aria-haspopup="dialog"
                          className="font-noto w-[164px] cursor-pointer text-left text-[clamp(14px,1.389vw,20px)] leading-[clamp(20px,1.806vw,26px)] font-light text-[#9fc2ff] transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9fc2ff]"
                        >
                          點擊查詢詳細內容
                        </button>
                      </div>
                    </div>
                  )
                })}
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      {isWorkshopDetailOpen && (
        <WorkshopDetailModal
          image={workshopDetail}
          alt={workshopDetailAlt}
          onClose={closeWorkshopDetail}
        />
      )}
    </div>
  )
}
