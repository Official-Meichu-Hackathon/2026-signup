import { useEffect, useRef, useState } from 'react'
import logo14th from '../../assets/Problems/logo-14th.svg'
import ctaSparkle from '../../assets/Problems/cta-sparkle.svg'
import cardDecor from '../../assets/Problems/maker-panel-decor.svg'
import orgWda from '../../assets/Problems/org-wda.png'
import orgCity from '../../assets/Problems/org-city.png'
import orgYouth from '../../assets/Problems/org-youth.png'
import orgApp from '../../assets/Problems/org-app.png'

// 創客交流組題目說明電腦版（元件組 810:3525，卡片 961.28×537.6）。
// 設計稿把點擊後的過場拆成 8 個變體，這裡把它們讀成動畫的關鍵影格：
//   Default/Variant2  創客交流組 + CLICK！（Variant2 少了裝飾星）
//   Variant3          文字放大並轉暗
//   Variant4          全黑
//   Variant5/6/7      2026 →＋新竹X梅竹黑客松 →＋四個主辦單位 logo
//   Variant8          標題縮小移到頂端＋說明文字＋詳細題目說明連結
// 設計稿的座標都以 961.28 寬為基準，故一律用 cq() 換成 cqw，卡片縮放時
// 字級與位置才會等比跟著變。
const CARD_W = 961.28
const CARD_H = 537.6
const cq = (n: number) => `${((n / CARD_W) * 100).toFixed(3)}cqw`
const pctX = (n: number) => `${((n / CARD_W) * 100).toFixed(2)}%`
const pctY = (n: number) => `${((n / CARD_H) * 100).toFixed(2)}%`

// 設計稿的原型參數（每段時長、緩動）MCP 讀不到，故依分鏡自行拓一個節奏，
// 全程約 3.2 秒。想調整整段快慢改這裡即可。注意 DELAY_LOGOS 加上最後一顆
// logo 的錯開（3×60ms）再加 FADE_IN_MS 必須小於 REVEAL_MS，否則 logo 還沒
// 淡入完就被切到下一階段（等於看不到）。
const FADE_MS = 650 // 起始內容放大淡出
const FADE_IN_MS = 520 // reveal 階段每個元素自己的淡入時長
const DELAY_2026 = 0 // 以下三個是 reveal 階段內的相對延遲
const DELAY_TITLE = 330
const DELAY_LOGOS = 650
const REVEAL_MS = 1800 // reveal 停留多久後進 content（logo 全亮後再停 450ms）
const CONTENT_MS = 780 // 標題縮到頂端＋說明文字與連結浮現

type Stage = 'idle' | 'fading' | 'reveal' | 'content'

// 星座光暈（Variant7 之前為原尺寸，Variant8 的字較小故光暈也按比例縮小）
const glow = (scale: number) =>
  [
    `0 0 ${cq(20 * scale)} rgba(255,255,255,0.5)`,
    `0 ${cq(4 * scale)} ${cq(40 * scale)} rgba(255,255,255,0.5)`,
    `0 ${cq(4 * scale)} ${cq(50 * scale)} rgba(255,255,255,0.5)`,
  ].join(', ')

const ORG_LOGOS = [
  // 838:3060 勞力發展署 / 3059 市政府 / 3058 青年發展中心 / 3057 應用
  {
    src: orgWda,
    alt: '勞動部勞動力發展署',
    left: 233.44,
    top: 353.6,
    w: 90.4,
    h: 89.6,
  },
  {
    src: orgCity,
    alt: '新竹市政府',
    left: 360.64,
    top: 354.4,
    w: 85.6,
    h: 74.4,
  },
  {
    src: orgYouth,
    alt: '新竹市青年發展中心',
    left: 483.04,
    top: 372.8,
    w: 127.2,
    h: 50.4,
  },
  { src: orgApp, alt: '應用', left: 647.04, top: 353.6, w: 80, h: 80 },
]

const PARAGRAPH = [
  '在四個子題中，運用 AI、大數據、物聯網等技術，',
  '針對市政服務提出創新解方，從智慧交通、公共安全到環境檢測，',
  '打造更即時、便利、貼近市民需求的智慧應用，',
  '共創友善高效的未來城市。',
]

export default function MakerCta() {
  const [stage, setStage] = useState<Stage>('idle')
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const play = () => {
    if (stage !== 'idle') return
    setStage('fading')
    timers.current.push(
      window.setTimeout(() => setStage('reveal'), FADE_MS),
      window.setTimeout(() => setStage('content'), FADE_MS + REVEAL_MS),
    )
  }

  const reset = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setStage('idle')
  }

  const isIdle = stage === 'idle'
  const revealed = stage === 'reveal' || stage === 'content'
  const isContent = stage === 'content'

  // 設計稿的圓角刻意不對稱：右下角幾乎是直角
  // （108.16/108.16/7.04/108.16 之於 961.28 寬）
  const cardRadius = '11.252cqw 11.252cqw 0.732cqw 11.252cqw'
  const cardShape =
    'maker-panel relative block aspect-[961/538] w-full overflow-hidden'

  return (
    // @container 在外層，卡片自己的圓角才能用 cqw（cqw 不能參照自己）
    <div className="@container w-full">
      <button
        type="button"
        onClick={isIdle ? play : reset}
        aria-label={
          isIdle ? '展開創客交流組題目說明' : '收合創客交流組題目說明'
        }
        className={`${cardShape} cursor-pointer`}
        style={{ borderRadius: cardRadius }}
      >
        <img
          src={cardDecor}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-65 mix-blend-screen"
        />
        {/* 書法字 logo（810:2643）。過場時與其他起始內容一起放大淡出 */}
        <div
          className="ease-out-strong absolute inset-0 transition-all"
          style={{
            opacity: isIdle ? 1 : 0,
            transform: isIdle ? 'scale(1)' : 'scale(2.6)',
            transitionDuration: `${FADE_MS}ms`,
          }}
        >
          <img
            src={logo14th}
            alt="梅竹黑客松 14th"
            className="absolute top-[3%] left-[7.4%] w-[63.9%]"
          />
          {/* 裝飾星（810:4413）。設計稿 Variant2 起就不再出現 */}
          <img
            src={ctaSparkle}
            alt=""
            className="absolute top-[41.3%] left-[76.8%] w-[12.65%] -translate-x-1/2 -translate-y-1/2"
          />
          {/* 創客交流組（810:3523：中心 y 55.12%、100px） */}
          <p
            className="font-zen text-ink absolute left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center"
            style={{
              top: pctY(296.32),
              fontSize: cq(100),
              lineHeight: cq(64),
              textShadow: glow(0.64),
            }}
          >
            創客交流組
          </p>
          {/* CLICK！（810:8908：中心 y 73.13%、35px、輔助文字色02） */}
          <p
            className="font-zen text-periwinkle absolute left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center"
            style={{
              top: pctY(393.12),
              fontSize: cq(35),
              lineHeight: cq(44),
              textShadow: glow(0.64),
            }}
          >
            CLICK！
          </p>
        </div>

        {/* 2026（Variant5 起）。Variant7→8 會縮小並移到卡片頂端 */}
        <p
          className="font-zen text-periwinkle ease-out-strong absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-center transition-all"
          style={{
            top: isContent ? pctY(45) : pctY(143.2),
            width: isContent ? pctX(219.52) : pctX(627.2),
            fontSize: isContent ? cq(35) : cq(100),
            lineHeight: isContent ? cq(44) : cq(64),
            textShadow: glow(isContent ? 0.28 : 0.8),
            opacity: revealed ? 1 : 0,
            transitionDelay: stage === 'reveal' ? `${DELAY_2026}ms` : '0ms',
            transitionDuration: isContent
              ? `${CONTENT_MS}ms`
              : `${FADE_IN_MS}ms`,
          }}
        >
          2026
        </p>

        {/* 新竹X梅竹黑客松（Variant6 起，比 2026 慢半拍浮現） */}
        <p
          className="font-zen text-ink ease-out-strong absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-center transition-all"
          style={{
            top: isContent ? pctY(89.1) : pctY(269.2),
            width: isContent ? pctX(295.4) : pctX(794),
            fontSize: isContent ? cq(35) : cq(100),
            lineHeight: isContent ? cq(44) : cq(64),
            textShadow: glow(isContent ? 0.28 : 0.8),
            opacity: revealed ? 1 : 0,
            transitionDelay: stage === 'reveal' ? `${DELAY_TITLE}ms` : '0ms',
            transitionDuration: isContent
              ? `${CONTENT_MS}ms`
              : `${FADE_IN_MS}ms`,
          }}
        >
          新竹X梅竹黑客松
        </p>

        {/* 四個主辦單位 logo（Variant7）。到 Variant8 就淡出讓位給說明文字 */}
        {ORG_LOGOS.map((logo, index) => (
          <img
            key={logo.alt}
            src={logo.src}
            alt={logo.alt}
            className="absolute object-contain transition-opacity"
            style={{
              left: pctX(logo.left),
              top: pctY(logo.top),
              width: pctX(logo.w),
              height: pctY(logo.h),
              opacity: stage === 'reveal' ? 1 : 0,
              transitionDelay:
                stage === 'reveal' ? `${DELAY_LOGOS + index * 60}ms` : '0ms',
              transitionDuration: `${FADE_IN_MS}ms`,
            }}
          />
        ))}

        {/* 說明文字（937:61387：中心 y 49.89%、內文 20/26） */}
        <div
          className="font-noto text-ink ease-out-strong absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-semibold transition-all"
          style={{
            top: pctY(268.2),
            width: pctX(654),
            fontSize: cq(20),
            lineHeight: cq(26),
            opacity: isContent ? 1 : 0,
            transitionDelay: isContent ? `${CONTENT_MS * 0.4}ms` : '0ms',
            transitionDuration: `${CONTENT_MS}ms`,
          }}
        >
          {PARAGRAPH.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        {/* 詳細題目說明 >>（937:61388：中心 y 83.18%、三級標題 30/44）。
            TODO: 待主辦提供題目說明 PDF 的網址後換掉 href */}
        <a
          href="#"
          onClick={(event) => event.preventDefault()}
          className="font-noto text-periwinkle ease-out-strong absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-semibold transition-all hover:underline"
          style={{
            top: pctY(447.2),
            width: pctX(345),
            fontSize: cq(30),
            lineHeight: cq(44),
            textShadow: glow(0.28),
            opacity: isContent ? 1 : 0,
            pointerEvents: isContent ? 'auto' : 'none',
            transitionDelay: isContent ? `${CONTENT_MS * 0.6}ms` : '0ms',
            transitionDuration: `${CONTENT_MS}ms`,
          }}
        >
          詳細題目說明 &gt;&gt;
        </a>
      </button>
    </div>
  )
}
