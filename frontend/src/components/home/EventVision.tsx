import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import activityImage1 from '../../assets/home/activity/image-1.webp'
import activityImage2 from '../../assets/home/activity/image-2.webp'
import activityImage3 from '../../assets/home/activity/image-3.webp'
import activityImage4 from '../../assets/home/activity/image-4.webp'
import activityImage5 from '../../assets/home/activity/image-5.webp'
import activityImage6 from '../../assets/home/activity/image-6.webp'
import activityImage7 from '../../assets/home/activity/image-7.webp'
import activityImage8 from '../../assets/home/activity/image-8.webp'
import activityImage9 from '../../assets/home/activity/image-9.webp'
import activityImage10 from '../../assets/home/activity/image-10.webp'
import activityImage11 from '../../assets/home/activity/image-11.webp'
import activityImage12 from '../../assets/home/activity/image-12.webp'
import activityHero from '../../assets/home/activity/hero.webp'

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

type Corner = 'top-left' | 'bottom-left' | 'bottom-right' | 'top-right'

type SequencePhoto = {
  src?: string
  label: string
}

// 角落飛出方向固定：左上 → 左下 → 右下 → 右上，依序循環
const CORNER_ORDER: Corner[] = [
  'top-left',
  'bottom-left',
  'bottom-right',
  'top-right',
]

// 照片「飛出方向」的單位向量（不是最終停留點，會再乘上距離讓它一路飛出畫面）
const CORNER_DIRECTION: Record<Corner, { x: number; y: number }> = {
  'top-left': { x: -1, y: -1 },
  'bottom-left': { x: -1, y: 1 },
  'bottom-right': { x: 1, y: 1 },
  'top-right': { x: 1, y: -1 },
}

const SEQUENCE_PHOTOS: SequencePhoto[] = [
  { label: '照片 01', src: activityImage1 },
  { label: '照片 02', src: activityImage2 },
  { label: '照片 03', src: activityImage3 },
  { label: '照片 04', src: activityImage4 },
  { label: '照片 05', src: activityImage5 },
  { label: '照片 06', src: activityImage6 },
  { label: '照片 07', src: activityImage7 },
  { label: '照片 08', src: activityImage8 },
  { label: '照片 09', src: activityImage9 },
  { label: '照片 10', src: activityImage10 },
  { label: '照片 11', src: activityImage11 },
  { label: '照片 12', src: activityImage12 },
]

const HERO_PHOTO: SequencePhoto = { label: '主視覺照片', src: activityHero }

const VISION_PARAGRAPHS = [
  'Hack 為黑客精神，指的是對解決問題懷有強烈熱忱的人；而 Marathon 則是取其長期抗戰之意——「Hackathon」，不只是一場技術的競技，更是一場集結各領域思想家與實踐者，關於「解決問題」的馬拉松。',
  '梅竹黑客松的舞台，致力於突破領域間的既定界限，促進跨領域間的意見交流。在密集的限時挑戰中，參賽者運用企業提供的資源，透過團隊協作與腦力激盪，將抽象的靈感轉化為最小可行性產品（MVP, Minimum Viable Product）。',
  '在梅竹黑客松，創意不只是被提出，更是被驗證。除了競賽主題本身，幾乎沒有限制的舞台，可以使參賽者們自由的發揮想法，去跳脫框架、整合技能，也能讓企業能夠用最真實角度看到及接觸人才，一同為當前的社會難題尋找前所未有的科技解方。',
  '作為全台規模最大的校園黑客松，自 2013 年起，我們每年定期在9月下旬到 10 月中旬間舉行大型黑客松年會。我們不只追求限時內的創意爆發，更期盼透過梅竹黑客松，種下改變未來的種子。我們相信，當不同背景、對問題有獨到見解的人們齊聚一堂，便能凝聚出翻轉現狀的力量，並將其轉化為推動進步的永續動能，在瞬息萬變的時代裡，在新竹這個科技城，共同創造具備長遠影響力的嶄新篇章。',
]

// ---- 以下數字都是「捲動距離」，單位 vh（1 = 一個螢幕高），想調整節奏只需要改這幾個數字 ----

// 每張照片從中心出現、飛出畫面外、完全消失，總共需要捲動多少 vh：數字越大飛得越慢、越久
const PHOTO_FLY_VH = 150
// 下一張照片開始飛出的間隔（vh）：比 PHOTO_FLY_VH 小，兩張照片的動畫會重疊、連續不中斷
const PHOTO_STAGGER_VH = 30
// 主視覺照片淡入、放大到定位，需要捲動多少 vh
const HERO_APPEAR_VH = 80
// 主視覺照片停留（定格不動）的時間，需要捲動多少 vh：想讓它停留久一點，把這個數字調大就好
const HERO_HOLD_VH = 300

const SEQUENCE_END_VH =
  (SEQUENCE_PHOTOS.length - 1) * PHOTO_STAGGER_VH + PHOTO_FLY_VH
const HERO_APPEAR_END_VH = SEQUENCE_END_VH + HERO_APPEAR_VH
// 整段動畫實際「可捲動」的距離；加上 100vh 是給 sticky 釘住畫面用的
const SCROLL_DISTANCE_VH = HERO_APPEAR_END_VH + HERO_HOLD_VH
const SECTION_HEIGHT_VH = SCROLL_DISTANCE_VH + 100

// 把 vh 距離換算成 useScroll 回傳的 0~1 進度
const toProgress = (vh: number) => vh / SCROLL_DISTANCE_VH

const SEQUENCE_END = toProgress(SEQUENCE_END_VH)
const HERO_APPEAR_START = SEQUENCE_END
const HERO_APPEAR_END = toProgress(HERO_APPEAR_END_VH)

// ---- 照片飛行的形狀：全部用「這張照片自己的 0~1 進度」連續計算，中途不會有停頓 ----

// 照片一開始出現時的大小（可調）
const PHOTO_START_SCALE = 0.2
// 照片飛到最遠、消失前放大到多大（可調，數字越大「衝出畫面」的感覺越強）
const PHOTO_EXIT_SCALE = 4
// 自己的時間裡，前面這一段比例只淡入、還不會開始飛（0~1）
const APPEAR_FRACTION = 0.15
// 開始飛之後，進度超過這個比例才開始淡出（0~1，相對於「開始飛」之後的進度）
const FADE_START_FRACTION = 0.55
// 飛行方向的最大距離，確保飛到底時已經完全出畫面外
const FLIGHT_DISTANCE_VW = 75
const FLIGHT_DISTANCE_VH = 65

function SequencePhotoItem({
  photo,
  corner,
  sliceStart,
  sliceEnd,
  progress,
  zIndex,
}: {
  photo: SequencePhoto
  corner: Corner
  sliceStart: number
  sliceEnd: number
  progress: MotionValue<number>
  zIndex: number
}) {
  const sliceLen = sliceEnd - sliceStart
  const dir = CORNER_DIRECTION[corner]

  // localFraction：這張照片自己的 0~1 生命週期
  const localFraction = (p: number) => clamp01((p - sliceStart) / sliceLen)
  // flightFraction：扣掉淡入階段後，飛行動作本身的 0~1 進度
  const flightFraction = (f: number) =>
    f <= APPEAR_FRACTION
      ? 0
      : clamp01((f - APPEAR_FRACTION) / (1 - APPEAR_FRACTION))
  // 用平方讓飛行持續加速，不會在角落附近變慢或停下
  const eased = (ff: number) => ff * ff

  const x = useTransform(progress, (p) => {
    const ff = eased(flightFraction(localFraction(p)))
    return `${dir.x * FLIGHT_DISTANCE_VW * ff}vw`
  })
  const y = useTransform(progress, (p) => {
    const ff = eased(flightFraction(localFraction(p)))
    return `${dir.y * FLIGHT_DISTANCE_VH * ff}vh`
  })
  const scale = useTransform(progress, (p) => {
    const ff = eased(flightFraction(localFraction(p)))
    return PHOTO_START_SCALE + (PHOTO_EXIT_SCALE - PHOTO_START_SCALE) * ff
  })
  const opacity = useTransform(progress, (p) => {
    const f = localFraction(p)
    if (f <= APPEAR_FRACTION) return f / APPEAR_FRACTION
    const ff = flightFraction(f)
    if (ff < FADE_START_FRACTION) return 1
    return 1 - (ff - FADE_START_FRACTION) / (1 - FADE_START_FRACTION)
  })

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{ zIndex }}
    >
      <motion.div
        data-sequence-photo={photo.label}
        style={{ x, y, scale, opacity }}
        className="aspect-[4/3] w-[26vw] max-w-[320px] overflow-hidden shadow-[0px_10px_30px_0px_rgba(0,0,0,0.35)]"
      >
        {photo.src ? (
          <img
            src={photo.src}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/10 text-sm text-white/50 backdrop-blur-sm">
            {photo.label}
          </div>
        )}
      </motion.div>
    </div>
  )
}

function HeroPhoto({ progress }: { progress: MotionValue<number> }) {
  const scale = useTransform(
    progress,
    [HERO_APPEAR_START, HERO_APPEAR_END],
    [0.4, 1],
  )
  // 不是淡入/淡出，而是從模糊逐漸變清楚，圖片本身沒有漸層透明度動畫
  const filter = useTransform(
    progress,
    [HERO_APPEAR_START, HERO_APPEAR_END],
    ['blur(25px)', 'blur(0px)'],
  )
  // 在照片輪播結束前完全不出現，時間一到才瞬間切換顯示（不是漸層淡入）
  const opacity = useTransform(progress, (p) => (p < HERO_APPEAR_START ? 0 : 1))

  return (
    <motion.div
      style={{ scale, filter, opacity }}
      className="absolute top-1/2 left-1/2 z-20 -mt-[44vh] -ml-[43.5vw] h-[88vh] w-[87vw] overflow-hidden shadow-[0px_20px_50px_0px_rgba(0,0,0,0.45)]"
    >
      {HERO_PHOTO.src ? (
        <img
          src={HERO_PHOTO.src}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-white/10 text-lg text-white/50 backdrop-blur-sm">
          {HERO_PHOTO.label}
        </div>
      )}
    </motion.div>
  )
}

export default function EventVision() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      id="vision"
      ref={sectionRef}
      data-resize-scroll-section="vision"
      className="home-vision-section relative"
      style={{ height: `${SECTION_HEIGHT_VH}vh` }}
    >
      <div className="vision-mobile">
        <img
          src={HERO_PHOTO.src}
          alt="梅竹黑客松活動大合照"
          loading="lazy"
          decoding="async"
          className="vision-mobile-photo"
        />
        <div className="vision-mobile-copy">
          {VISION_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph.slice(0, 8)}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="vision-desktop sticky top-0 h-screen w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 px-6 text-center">
          {/* <div>
            <p className="font-['Zen_Antique'] text-2xl text-[#f6f6f6] [text-shadow:0px_0px_20px_rgba(255,255,255,0.35),0px_4px_40px_rgba(255,255,255,0.2)] md:text-[35px] md:leading-[44px]">
              活動願景
            </p>
          </div> */}
          <div className="md:font-noto flex w-full max-w-[957px] flex-col gap-4 text-justify text-base leading-[1.9] font-semibold text-white/90 md:gap-[26px] md:text-[22px] md:leading-[26px]">
            {VISION_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph.slice(0, 8)}>{paragraph}</p>
            ))}
          </div>
        </div>

        {SEQUENCE_PHOTOS.map((photo, i) => (
          <SequencePhotoItem
            key={photo.label}
            photo={photo}
            corner={CORNER_ORDER[i % CORNER_ORDER.length]}
            sliceStart={toProgress(i * PHOTO_STAGGER_VH)}
            sliceEnd={toProgress(i * PHOTO_STAGGER_VH + PHOTO_FLY_VH)}
            progress={scrollYProgress}
            zIndex={SEQUENCE_PHOTOS.length - i}
          />
        ))}
        <HeroPhoto progress={scrollYProgress} />
      </div>
    </section>
  )
}
