import { useState } from 'react'
import groupHacker from '../../assets/home/group-hacker.jpg'
import groupMaker from '../../assets/home/group-maker.jpg'
import Sparkle from './Sparkle'

type GroupKey = 'hacker' | 'maker'

const TABS: { key: GroupKey; label: string }[] = [
  { key: 'hacker', label: '黑客組' },
  { key: 'maker', label: '創客組' },
]

const CONTENT: Record<
  GroupKey,
  { image: string; intro: string; workshop: string }
> = {
  hacker: {
    image: groupHacker,
    intro:
      '致力於搭起學界與業界之間的橋樑，參賽者將運用企業資源並發揮創意回應企業命題，讓想像力與實作並存！2026 年梅竹黑客松將由以下七家企業作為引導單位：CloudMosa、恩智浦半導體、台積電、羅技、Google、AMD、聚陽實業。',
    workshop:
      '每間合作企業皆會舉辦工作坊，透過工作坊，參賽者將領取到企業所提供的硬體設備或軟體資源，並且由企業之技術人員親自教學，簡易的指導參賽者如何使用相關技術或資源。舉辦地點與時間將依不同企業而定。',
  },
  maker: {
    image: groupMaker,
    intro:
      '由新竹市政府命題，鼓勵參賽者運用 AI、大數據、物聯網等科技，針對市政服務提出創新解方，從智慧交通、公共安全到環境監測，打造更即時、便利、貼近市民需求的智慧應用，共創友善高效的未來城市。',
    workshop:
      '由市府團隊主辦，工作坊將包含技術教學、題目講解等內容，並包含參賽團隊選題之流程。過程中參賽者將與講師討論應用技術，共同激盪出更多的靈感與創意。',
  },
}

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

export default function GroupIntro() {
  const [tab, setTab] = useState<GroupKey>('hacker')
  const { image, intro, workshop } = CONTENT[tab]

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
            <img src={image} alt="" />
            <div className="group-mobile-copy">
              <p>{intro}</p>
              <p>{workshop}</p>
            </div>
            <a href="/registration" className="group-mobile-workshop">
              工作坊資訊
            </a>
          </div>
        </div>
      </div>

      <div className="group-intro-desktop mx-auto w-full max-w-[1440px] flex-col gap-8 py-16 sm:flex-row sm:gap-10 lg:gap-16 xl:gap-[151px]">
        <div
          className="flex shrink-0 flex-row items-end px-6 sm:relative sm:left-[calc(50%-50vw)] sm:flex-col sm:items-start sm:px-0"
          data-node-id="617:1329"
        >
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`relative flex cursor-pointer items-center justify-center rounded-t-[30px] border bg-gradient-to-br px-6 py-4 text-center font-semibold text-white backdrop-blur-[35px] transition-all duration-300 ease-out sm:h-[140px] sm:w-[80px] sm:rounded-t-none sm:rounded-r-[50px] sm:border-l-0 sm:px-0 sm:py-6 sm:text-xl sm:leading-none sm:tracking-[0.45em] sm:[writing-mode:vertical-rl] ${
                tab === key
                  ? 'z-10 border-white/45 from-white/[0.27] to-white/[0.08] opacity-100 shadow-[8px_12px_32px_rgba(0,0,0,0.38),inset_-2px_2px_10px_rgba(255,255,255,0.42),0_0_22px_rgba(176,200,255,0.2)] sm:w-[100px]'
                  : 'z-0 border-white/20 from-white/[0.11] to-white/[0.02] opacity-55 shadow-[6px_8px_20px_rgba(0,0,0,0.24),inset_-1px_1px_6px_rgba(255,255,255,0.14)] hover:opacity-75'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-8 px-6 lg:gap-[45px] xl:pr-[116px]">
          <div className="relative">
            <Sparkle
              variant="bright"
              className="-top-3 left-[30%] h-8 w-8 md:-top-4 md:h-12 md:w-12"
            />
            <Sparkle
              variant="soft"
              className="top-4 left-[64%] h-6 w-6 md:top-6 md:h-8 md:w-8"
            />
            <p className="text-center font-['Zen_Antique'] text-2xl text-[#f6f6f6] [text-shadow:0px_0px_20px_rgba(255,255,255,0.35),0px_4px_40px_rgba(255,255,255,0.2)] md:text-[35px]">
              組別介紹
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:gap-[15px]">
            <p className="shrink-0 font-semibold text-white">組別介紹</p>
            <GlassCard className="flex min-w-0 flex-1 flex-col items-center gap-6 p-8 lg:h-[334px] lg:flex-row lg:justify-center lg:gap-[54px] lg:py-[72px] lg:pr-[62px] lg:pl-[57px]">
              <img
                src={image}
                alt=""
                className="h-[180px] w-full max-w-[280px] shrink-0 rounded-[41px] object-cover lg:h-[208px] xl:max-w-[340px]"
              />
              <p className="min-w-0 flex-1 leading-[32px] font-semibold text-white">
                {intro}
              </p>
            </GlassCard>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:gap-[15px]">
            <p className="shrink-0 font-semibold text-white">工作坊</p>
            <GlassCard className="flex min-w-0 flex-1 flex-col items-center gap-6 p-8 lg:h-[334px] lg:flex-row lg:justify-center lg:gap-[54px] lg:px-[57px] lg:py-[63px]">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <p className="leading-[32px] font-semibold text-white">
                  {workshop}
                </p>
                <p className="text-right font-light text-[#9fc2ff]">
                  點擊查詢詳細內容
                </p>
              </div>
              <div className="h-[180px] w-full max-w-[280px] shrink-0 rounded-[41px] bg-white lg:h-[208px] xl:max-w-[340px]" />
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}
