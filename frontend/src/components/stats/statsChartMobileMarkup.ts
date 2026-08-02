import statsChartMobileRaw from '../../assets/Stats/stats_chart_mobile.svg?raw'

// 這個模組只被 MobileStatsAccordion 用 import() 動態載入，目的是讓 Vite 把 422KB
// 的素材切成獨立 chunk。若在元件裡直接靜態 import '...?raw'，素材會被併進主 JS
// chunk（gzip 約 +155KB），連首頁訪客都要下載一張只有手機統計頁會用到的圖。
//
// Figma 匯出的素材有兩個東西會讓內容變糊，都在這裡剝掉 —— 素材檔本身不動，設計
// 那邊重匯也不會被蓋掉。
//
// 1. filter：整份內容（四顆圓餅、全部標籤文字）被包在 <g filter="url(#filter0_di)">
//    裡，而那個 filter 其實只是面板的投影＋內陰影；四顆圓餅各自的 filter1–4 也同樣
//    包住了自己的標籤。SVG filter 會強制整個子樹先點陣化再合成，WebKit 對 filter
//    表面的解析度有上限，裡面的字就跟著被壓扁。面板的陰影改用 .glass-dark 補回來，
//    它的 box-shadow 本來就跟 filter0 等價（inset 0 1px 8px 白 50% ↔ dy1/blur4；
//    0 10px 30px 黑 25% ↔ dy10/stdDeviation15，CSS 模糊半徑約是 stdDeviation 兩倍）。
//    代價是四顆圓餅各自的投影會消失 —— 在深色面板上幾乎看不出來，換標籤銳利划算。
// 2. foreignObject：裡面那個 backdrop-filter 的 div，在 <img> 裡 WebKit 根本不會畫，
//    改成內嵌之後才會生效、等於多糊一層頁面背景。.glass-dark 已經有 blur(70px) 了。
//
// width／height 屬性也一併拿掉，好讓 CSS 的 100% 能把它撐滿容器（小螢幕上容器會
// 比 343 窄，留著固定尺寸會溢出）。
const CHART_MARKUP = statsChartMobileRaw
  .replace(/<foreignObject[\s\S]*?<\/foreignObject>/g, '')
  .replace(/ filter="url\(#[^)]*\)"/g, '')
  .replace(/^<svg[^>]*?>/, (tag) =>
    tag.replace(/ (?:width|height)="[^"]*"/g, ''),
  )

export default CHART_MARKUP
