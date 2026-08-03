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

// 設計稿的原型參數（每段時長、緩動）MCP 讀不到，故依分鏡自行拓一個節奏。
// 下面的基準值是原本的 3.2 秒版本，再乘上 SPEED 統一放慢 —— 市府反映點擊後的
// 轉場太快。要再快或再慢只改 SPEED 一個數字即可，各段的相對比例（分鏡）不變。
//
// 全部時間都走同一個倍率，所以下面這個約束會自動維持：DELAY_LOGOS 加上最後一顆
// logo 的錯開（3×LOGO_STAGGER_MS）再加 FADE_IN_MS 必須小於 REVEAL_MS，否則 logo
// 還沒淡入完就被切到下一階段（等於看不到）。
const SPEED = 1.5 // 1 = 原速（3.2 秒），1.5 = 現在的 4.8 秒
const ms = (n: number) => Math.round(n * SPEED)

const FADE_MS = ms(650) // 起始內容放大淡出
const FADE_IN_MS = ms(520) // reveal 階段每個元素自己的淡入時長
const DELAY_2026 = ms(0) // 以下三個是 reveal 階段內的相對延遲
const DELAY_TITLE = ms(330)
const DELAY_LOGOS = ms(650)
const LOGO_STAGGER_MS = ms(60) // 四顆主辦單位 logo 之間的錯開
const REVEAL_MS = ms(1800) // reveal 停留多久後進 content（logo 全亮後再停 450ms）
const CONTENT_MS = ms(780) // 標題縮到頂端＋說明文字與連結浮現

type Stage = 'idle' | 'fading' | 'reveal' | 'content'

const MAKER_PROBLEM_DETAILS_URL =
  'https://docs.google.com/document/d/10dB3iZReJZ-uT2fVgQWBuNdGp5iJ0w7UpmpnZbsIX44/edit?tab=t.0'

// 星座光暈（Variant7 之前為原尺寸，Variant8 的字較小故光暈也按比例縮小）
const glow = (scale: number) =>
  [
    `0 0 ${cq(20 * scale)} rgba(255,255,255,0.5)`,
    `0 ${cq(4 * scale)} ${cq(40 * scale)} rgba(255,255,255,0.5)`,
    `0 ${cq(4 * scale)} ${cq(50 * scale)} rgba(255,255,255,0.5)`,
  ].join(', ')

// 兩行主標題（2026 / 新竹X梅竹黑客松）在 reveal→content 之間會縮小並上移。
// 原本是直接對 font-size、line-height、top 做 transition，但字級每一幀都在變，
// 文字的基線在行框內會被重新對齊到像素格上 —— 實測沿著整條路徑取樣，字的視覺
// 中心一階差分應該固定在 −8.98，實際卻在 −8.48 與 −9.48 之間來回跳，等於每幀
// 偏離理想路徑約 ±0.5px。那就是看起來會抖的原因。
//
// 改成只動畫 transform：字級固定在大尺寸，縮小交給 scale、位移交給 translateY。
// 瀏覽器插的是變換矩陣、不會重排文字，路徑因此完全平滑。比例剛好對得上設計稿：
// 35/100 = 0.35，而光暈 glow(0.8) × 0.35 = glow(0.28)，正是 content 階段的值，
// 所以 scale 會順便把光暈縮到對的大小，不必再各自動畫。
//
// 行高只影響行框高度：元素以自身中心對齊 top（translate 的 −50%），單行文字的
// 視覺中心不受行高影響，故固定不動即可。寬度同理，用 max-content 讓它不參與動畫。
const STACK_SCALE = 35 / 100

// translate 的 −50% 取代原本的 -translate-x-1/2 / -translate-y-1/2 —— 內聯
// transform 會蓋掉那兩個 class，置中必須自己帶上。dy 的單位是設計稿的 px：
// cq(n) 換算出來的長度剛好等於 n 個設計 px，垂直方向也通用。
const stackTransform = (dy: number, shrunk: boolean) =>
  `translate(-50%, -50%) translateY(${cq(dy)}) scale(${shrunk ? STACK_SCALE : 1})`

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
  '競賽主題：新竹市AI領航青年數位工具補助—提升數位工具資安防禦與行政效能創新方案',
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

        {/* 2026（Variant5 起）。Variant7→8 會縮小並移到卡片頂端 —— 縮放與位移
            都交給 transform，理由見 STACK_SCALE 上方的註解。 */}
        <p
          className="font-zen text-periwinkle ease-out-strong absolute left-1/2 text-center whitespace-nowrap transition-all"
          style={{
            top: pctY(143.2),
            width: 'max-content',
            fontSize: cq(100),
            lineHeight: cq(64),
            textShadow: glow(0.8),
            transform: stackTransform(isContent ? 45 - 143.2 : 0, isContent),
            opacity: revealed ? 1 : 0,
            transitionDelay: stage === 'reveal' ? `${DELAY_2026}ms` : '0ms',
            transitionDuration: isContent
              ? `${CONTENT_MS}ms`
              : `${FADE_IN_MS}ms`,
          }}
        >
          2026
        </p>

        {/* 新竹X梅竹黑客松（Variant6 起，比 2026 慢半拍浮現）
            whitespace-nowrap 是必要的，不是保險：設計稿給的文字框寬 794、字級
            100，而這八個字實際只要 7.70em，餘裕僅 2.5%（同一張卡上其他每一行都
            有 35% 以上）。這 2.5% 撐不住三件事——Zen Antique 是非同步載入的，載完
            前整串用系統備援字；「X」U+0058 不在 Zen Antique 裡，永遠走備援，而各
            平台的備援 serif 寬度不同；再加上百分比與 cqw 各自的四捨五入。任何一項
            吃掉那 2.5%，「松」就會被擠到第二行。
            寬度同時從設計稿的 794／295.4 改成 max-content：不換行之後那個固定寬
            度已經不再控制任何東西（文字靠 translate(-50%) 置中，與框寬無關），但
            只要備援字寬超過框，溢出只會往右單邊跑、標題就會偏掉。讓框貼著文字就
            永遠是對稱的。 */}
        <p
          className="font-zen text-ink ease-out-strong absolute left-1/2 text-center whitespace-nowrap transition-all"
          style={{
            top: pctY(269.2),
            width: 'max-content',
            fontSize: cq(100),
            lineHeight: cq(64),
            textShadow: glow(0.8),
            transform: stackTransform(isContent ? 89.1 - 269.2 : 0, isContent),
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
                stage === 'reveal'
                  ? `${DELAY_LOGOS + index * LOGO_STAGGER_MS}ms`
                  : '0ms',
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
          href={MAKER_PROBLEM_DETAILS_URL}
          target="_blank"
          rel="noopener noreferrer"
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
