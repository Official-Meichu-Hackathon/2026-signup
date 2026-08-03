import { useEffect, useState } from 'react'

// iOS Safari 的 window.innerWidth／innerHeight 回報的是「視覺視窗」(visual
// viewport)：使用者雙指放大時它會跟著縮小（放大兩倍就剩一半），而且縮放結束還會
// 補送一個 resize 事件。凡是把版面尺寸建立在 innerWidth 上的頁面，只要被放大一
// 次就會整個重排到縮放後的寬度上 —— 手指放開時版面已經跑掉了。
//
// document.documentElement.clientWidth 是「版面視窗」(layout viewport)，不受雙
// 指縮放影響；只有裝置旋轉、視窗真的改變大小、或網址列收合時才會變，而那些才是
// 版面該重排的時機。高度同理。
//
// 這支 hook 專給「照設計稿鎖死比例、再用 JS 換算縮放倍率」的頁面用，目前是
// MobileProblemsView、MobileStatsView 與 MobileProblemDeck 的放大檢視。純 CSS
// 排版（%／vw／rem）的頁面不需要它 —— 那也正是為什麼只有這幾頁會出這個 bug。
const read = () => ({
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
})

export function useLayoutViewport() {
  const [viewport, setViewport] = useState(read)

  useEffect(() => {
    const onResize = () => {
      const next = read()
      // iOS 捲動時網址列伸縮會狂發 resize。尺寸沒變就回傳同一個物件，讓 React
      // 直接跳過這次更新，不然每一次伸縮都要整頁重算版面。
      setViewport((prev) =>
        prev.width === next.width && prev.height === next.height ? prev : next,
      )
    }

    // 掛上監聽與第一次 render 之間視窗可能已經變了（字型載入、網址列初始收合），
    // 補讀一次才不會停在過期的尺寸上。
    onResize()

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return viewport
}
