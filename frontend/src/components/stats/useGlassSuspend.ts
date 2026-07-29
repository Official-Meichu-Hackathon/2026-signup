import { useEffect, useRef } from 'react'

// While an accordion row's height animates, every glass surface on the page
// either resizes (the panel being revealed) or moves (the bars and footer
// sliding down), so its backdrop-filter blur would be recomputed on every
// frame — that, not the height animation itself, is what makes the toggle
// stutter. The blur is suspended for the transition and restored at rest.
//
// 電腦版與手機版共用同一份，是因為 glassSuspendCount 必須是「同一個」計數器：
// 它守的是掛在 <html> 上的同一個 class。若兩邊各自複製一份，兩個計數器會互相
// 打架 —— 其中一邊歸零就把 class 拔掉，另一邊的動畫還在跑卻已經恢復模糊。
const GLASS_SUSPEND_CLASS = 'glass-suspend'

// 與 Collapsible 的 duration-500 對齊；改這裡也要改那邊的 Tailwind class。
export const COLLAPSE_MS = 500

let glassSuspendCount = 0

export function useGlassSuspend(isOpen: boolean) {
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    const root = document.documentElement
    glassSuspendCount++
    root.classList.add(GLASS_SUSPEND_CLASS)

    // release 有兩個觸發點：計時器到期，以及 effect 重跑時的 cleanup。少了這個
    // released 旗標，同一次 increment 會被扣兩次（計時器先燒掉，之後 cleanup 又扣
    // 一次），計數器一旦掉到負數就再也回不到 0，class 會永遠卡在 <html> 上 ——
    // 結果就是玻璃材質的 backdrop-filter 被永久停用。必須一次 increment 對應
    // 剛好一次 decrement。
    let released = false
    const release = () => {
      if (released) return
      released = true
      glassSuspendCount = Math.max(0, glassSuspendCount - 1)
      if (glassSuspendCount === 0) root.classList.remove(GLASS_SUSPEND_CLASS)
    }

    const timer = window.setTimeout(release, COLLAPSE_MS + 50)
    return () => {
      window.clearTimeout(timer)
      release()
    }
  }, [isOpen])
}
