import star2 from '../../assets/Problems/star-2.svg'
import star4 from '../../assets/Problems/star-4.svg'
import star5 from '../../assets/Problems/star-5.svg'

// 創客交流組面板右上角的三顆大星。
//
// 這三顆原本住在 ProblemStars 裡，但那層是 aspect-[1376.367/2020.722] w-[95.58%]
// ——高度由「視窗寬度」決定；而面板在 main 的排版流裡，位置是由 mt-[63rem] 這類
// 固定 rem 決定的。兩套基準不同，視窗一變寬星星就往下滑：1440 時它們在面板右上，
// 到 1920 就掉到 footer 旁邊。故改成錨在面板自己的框上，位置才會跟著面板走。
//
// 座標一律以面板設計稿尺寸（961.28×537.6）為基準：left/top 用面板寬高的百分比，
// 寬度用面板寬度的百分比、高度交給 aspect-ratio 推導，這樣三顆星的大小與形狀完全
// 不受視窗高度或面板以外的東西影響。
const PANEL_W = 961.28
const PANEL_H = 537.6

// 整組往下移的量（面板座標系的 px，正值往下）。三顆星的相對排列是設計稿的，
// 要整體上下微調改這一個數字就好，不用逐顆動 top。
const GROUP_OFFSET_Y = 130

// 每顆星的三層結構與 ProblemStars 相同：
//   1. 外層 = 設計稿量到的外框（旋轉後的 bounding box）
//   2. 中層 = 未旋轉的原始框（innerW/innerH），旋轉與傾斜掛在這層
//   3. img  = 素材本身，viewBox 為了容納星座光暈而外擴，故用負的 left/top
//      加上 >100% 的寬高把圖推回去
//
// boxW/boxH 是外框在設計稿裡的實際像素（= 原本在星層中量到的大小），換算成
// 百分比與長寬比交給下面的 render 做，維持與搬移前一模一樣的尺寸與形狀。
interface CtaStar {
  src: string
  left: number
  top: number
  boxW: number
  boxH: number
  innerW: number
  innerH: number
  rotate: number
  skew: number
  imgLeft: number
  imgTop: number
  imgW: number
  imgH: number
  delay: number
}

const STARS: CtaStar[] = [
  {
    // 最大的一顆，壓在面板右上角外側
    src: star2,
    left: 803,
    top: -152,
    boxW: 358.2,
    boxH: 205.8,
    innerW: 48.31,
    innerH: 118.54,
    rotate: 140.87,
    skew: 27.55,
    imgLeft: -28.6,
    imgTop: -18.67,
    imgW: 157.2,
    imgH: 140.58,
    delay: 1.2,
  },
  {
    // 中等的一顆，疊在上面那顆的左下
    src: star4,
    left: 817,
    top: -35,
    boxW: 200.8,
    boxH: 114,
    innerW: 68.45,
    innerH: 87.41,
    rotate: 40.77,
    skew: -35.07,
    imgLeft: -35.99,
    imgTop: -45.69,
    imgW: 171.98,
    imgH: 199.33,
    delay: 0.6,
  },
  {
    // 細長的一顆，落在面板右緣之外（超出的部分由頁面 overflow-hidden 裁掉）
    src: star5,
    left: 1078,
    top: -28,
    boxW: 83.5,
    boxH: 152.2,
    innerW: 114.87,
    innerH: 57.2,
    rotate: -78.77,
    skew: -30.65,
    imgLeft: -51.58,
    imgTop: -52.29,
    imgW: 203.16,
    imgH: 213.68,
    delay: 1.8,
  },
]

export default function MakerCtaStars() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {STARS.map((star) => (
        <div
          key={star.src}
          className="absolute"
          style={{
            left: `${((star.left / PANEL_W) * 100).toFixed(3)}%`,
            top: `${(((star.top + GROUP_OFFSET_Y) / PANEL_H) * 100).toFixed(3)}%`,
            width: `${((star.boxW / PANEL_W) * 100).toFixed(3)}%`,
            // 高度由寬度推導，形狀才不會被面板以外的東西影響
            aspectRatio: `${star.boxW} / ${star.boxH}`,
          }}
        >
          <div
            className="absolute"
            style={{
              left: `${(100 - star.innerW) / 2}%`,
              top: `${(100 - star.innerH) / 2}%`,
              width: `${star.innerW}%`,
              height: `${star.innerH}%`,
              transform: `rotate(${star.rotate}deg) skewX(${star.skew}deg)`,
            }}
          >
            <img
              src={star.src}
              alt=""
              className="animate-star-twinkle absolute max-w-none"
              style={{
                left: `${star.imgLeft}%`,
                top: `${star.imgTop}%`,
                width: `${star.imgW}%`,
                height: `${star.imgH}%`,
                animationDelay: `${star.delay}s`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
