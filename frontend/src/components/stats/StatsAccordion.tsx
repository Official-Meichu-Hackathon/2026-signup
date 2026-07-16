import { useState } from 'react'
import barCollapsed from '../../assets/Stats/bar-collapsed-1.svg'
import iconPlus from '../../assets/Stats/icon-plus.svg'
import iconMinus from '../../assets/Stats/icon-minus.svg'
import pieGrade from '../../assets/Stats/pie-grade.svg'
import pieSchool from '../../assets/Stats/pie-school.svg'
import pieDeptHacker from '../../assets/Stats/pie-dept-hacker.svg'
import pieDeptMaker from '../../assets/Stats/pie-dept-maker.svg'
import carouselArrow from '../../assets/Stats/carousel-arrow.svg'

// 參賽者感言 — 設計稿目前僅一則示意文字，之後換成歷屆參賽者真實回饋。
const TESTIMONIALS: Record<'hacker' | 'maker', string[]> = {
  hacker: [
    '“參加梅竹黑客松讓我們非常有成就感！我們花了很多時間鑽研自己未曾涉足的領域，通過團隊討論與協作嘗試新技術，也從中收穫不少知識和經驗，並且也順利在比賽中取得佳績，這讓大家都很滿足。”',
  ],
  maker: [
    '“參加梅竹黑客松讓我們非常有成就感！我們花了很多時間鑽研自己未曾涉足的領域，通過團隊討論與協作嘗試新技術，也從中收穫不少知識和經驗，並且也順利在比賽中取得佳績，這讓大家都很滿足。”',
  ],
}

const PIES = [
  { src: pieGrade, label: '參賽者年級比', tag: '' },
  { src: pieDeptHacker, label: '參賽者科系分佈', tag: '【黑客組】' },
  { src: pieSchool, label: '參賽者學校分佈', tag: '' },
  { src: pieDeptMaker, label: '參賽者科系分佈', tag: '【創客交流組】' },
]

// 手風琴橫幅：金屬漸層 SVG 作為底、標題置中、右側 +/− 按鈕。
function AccordionBar({
  title,
  isOpen,
  onToggle,
}: {
  title: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative block w-full cursor-pointer transition hover:brightness-110"
      aria-expanded={isOpen}
    >
      <img src={barCollapsed} alt="" className="w-full" />
      <span className="glow-text-subtle font-zen text-ink absolute inset-0 flex items-center justify-center text-3xl md:text-4xl">
        {title}
      </span>
      <img
        src={isOpen ? iconMinus : iconPlus}
        alt={isOpen ? '收合' : '展開'}
        className="absolute top-1/2 right-[4%] w-[3.5%] -translate-y-1/2"
      />
    </button>
  )
}

function Collapsible({
  isOpen,
  children,
}: {
  isOpen: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className="grid transition-[grid-template-rows] duration-500"
      style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}

function TestimonialCarousel({ quotes }: { quotes: string[] }) {
  const [index, setIndex] = useState(0)
  const step = (delta: number) =>
    setIndex((index + delta + quotes.length) % quotes.length)

  return (
    <div className="flex w-full items-center justify-center gap-4 md:gap-8">
      <button
        type="button"
        onClick={() => step(-1)}
        aria-label="上一則感言"
        className="shrink-0 transition hover:scale-110"
      >
        <img src={carouselArrow} alt="" className="w-8 -rotate-90 md:w-10" />
      </button>
      <div className="flex min-h-[280px] w-full max-w-[645px] items-center justify-center rounded-[60px] px-10 py-12 shadow-[0px_22px_68px_rgba(0,0,0,0.25),inset_0px_2px_18px_rgba(255,255,255,0.5)] backdrop-blur-xl md:rounded-[93px] md:px-14">
        <p className="font-noto text-periwinkle text-center text-xl leading-relaxed font-semibold">
          {quotes[index]}
        </p>
      </div>
      <button
        type="button"
        onClick={() => step(1)}
        aria-label="下一則感言"
        className="shrink-0 transition hover:scale-110"
      >
        <img src={carouselArrow} alt="" className="w-8 rotate-90 md:w-10" />
      </button>
    </div>
  )
}

export default function StatsAccordion() {
  const [openStats, setOpenStats] = useState(false)
  const [openQuotes, setOpenQuotes] = useState(false)

  return (
    <div className="flex w-full max-w-[1222px] flex-col">
      <AccordionBar
        title="梅竹黑客松參賽數據"
        isOpen={openStats}
        onToggle={() => setOpenStats(!openStats)}
      />
      <Collapsible isOpen={openStats}>
        <div className="mx-auto my-10 grid w-full max-w-[941px] grid-cols-1 gap-10 rounded-[48px] px-10 py-12 shadow-[0px_24px_72px_rgba(0,0,0,0.25),inset_0px_2px_19px_rgba(255,255,255,0.5)] backdrop-blur-2xl sm:grid-cols-2">
          {PIES.map((pie) => (
            <figure
              key={pie.label + pie.tag}
              className="flex flex-col items-center gap-4"
            >
              <figcaption className="font-noto text-ink text-center text-xl font-semibold">
                {pie.label}
                {pie.tag && <span className="text-periwinkle">{pie.tag}</span>}
              </figcaption>
              <img src={pie.src} alt={pie.label + pie.tag} className="w-60" />
            </figure>
          ))}
        </div>
      </Collapsible>

      <AccordionBar
        title="參賽者感言"
        isOpen={openQuotes}
        onToggle={() => setOpenQuotes(!openQuotes)}
      />
      <Collapsible isOpen={openQuotes}>
        <div className="my-10 flex flex-col items-center gap-12">
          <h3 className="glow-text-subtle font-zen text-periwinkle text-3xl">
            【黑客組】
          </h3>
          <TestimonialCarousel quotes={TESTIMONIALS.hacker} />
          <h3 className="glow-text-subtle font-zen text-periwinkle text-3xl">
            【創客交流組】
          </h3>
          <TestimonialCarousel quotes={TESTIMONIALS.maker} />
        </div>
      </Collapsible>

      {/* 成果平台網址 — 常駐展開卡片 */}
      <div className="relative mt-0 w-full">
        <img src={barCollapsed} alt="" className="w-full opacity-90" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <span className="font-zen text-ink text-3xl md:text-4xl">
            成果平台網址
          </span>
          {/* TODO: 成果平台上線後補上正式網址 */}
          <a
            href="#"
            className="font-zen text-periwinkle text-2xl underline-offset-4 transition hover:underline"
          >
            點擊文字即可進入
          </a>
        </div>
      </div>
    </div>
  )
}
