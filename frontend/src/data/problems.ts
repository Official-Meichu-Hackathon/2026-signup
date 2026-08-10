// 黑客組企業題目 — 內容取自 Figma「題目說明電腦版_黑客組_未公開2」
// （1601:61961）的 zoomin1–7 變體。
import logoCloudMosa from '../assets/Problems/logo-cloudmosa.png'
import logoLogitech from '../assets/Problems/logo-logitech.png'
import logoAmdItri from '../assets/Problems/logo-amd-itri.png'
import logoMakalot from '../assets/Problems/logo-makalot_V2.webp'
import logoMakalotMark from '../assets/Problems/logo-makalot-V3.webp'
import logoNxp from '../assets/Problems/logo-nxp-figma.png'
import logoWtMicro from '../assets/Problems/logo-wtmicro-figma.png'
import logoAdvantest from '../assets/Problems/logo-advantest-2.svg'
import logoGoogle from '../assets/Problems/logo-google.png'

// 題目全文於比賽當天另行公布，網站上一律只放 hashtag 提示，沒有公開/未公開
// 之分。
//
// ⚠ 題目全文不可以放進這個檔案（或 frontend/src 底下任何地方）。這支檔案的
// PROBLEMS 有被元件 import，整個陣列會原封不動打進 build 出來的 JS；就算欄位
// 沒有被任何元件讀取，tree-shaking 也拿不掉「有被用到的物件」裡的屬性，參賽者
// 開 DevTools 就看得到。之前的 paragraphs 欄位就是這樣外洩的，已於本 commit
// 移除。全文請留在前端 repo 之外。
export const HASHTAG_NOTE = '完整題目將於比賽當日公開'

export interface Problem {
  sponsor: string
  logos: string[]
  // 收合小卡專用的 logo，沒給就沿用 logos。小卡的 logo 框是設計稿逐家手調的
  // （見 ProblemDeck 的 LOGO_BOXES），比例固定，所以當放大卡換成另一種版式的
  // 素材時，小卡不一定跟著換得動 —— 聚陽就是這個情況。
  cardLogos?: string[]
  // 比賽前的提示標籤。七家都已給實際內容；設計稿的佔位樣式是「#......」，
  // 若日後有企業要暫時留白，照那個格式填即可。
  hashtags: string[]
  // 保密協定說明，只有部分企業有（如羅技）。設計稿放在企業名與分隔線之間。
  note?: string
}

export const PROBLEMS: Problem[] = [
  {
    sponsor: 'CloudMosa',
    logos: [logoCloudMosa],
    hashtags: ['#雲端運算', '#網頁開發', '#數位平權'],
  },
  {
    sponsor: '羅技',
    logos: [logoLogitech],
    hashtags: ['#AICopilot', '#FutureOfWork', '#AIGaming', '#PlayToWin'],
    note: '請務必簽署附件之保密協定，並於回傳組別繳費證明的郵件的同時，一併繳交個人的保密協定同意書，方為報名成功。',
  },
  {
    sponsor: 'AMD',
    logos: [logoAmdItri],
    hashtags: ['#PhysicalAI', '#Cloud-to-Edge AI Deployment', '#Robotics'],
  },
  {
    // 卡片上只放「聚陽實業」——全稱十個字在 278 寬的企業名框裡放不下會斷行，
    // 而報名表的志願序（PRIORITY_OPTIONS）本來就是用簡稱，兩邊一致。
    sponsor: '聚陽實業',
    logos: [logoMakalot],
    // 小卡另外給一張：小卡的框（LOGO_BOXES[3]，43.31%×20.04%，比例約 1.2）是照
    // 方形標誌手調的，放大卡用的 V2 是 5.2:1 的寬版標準字，塞進那個框只會剩細細
    // 一條。V3（1049×688，比例 1.525）比較接近框的比例，適合小卡。
    cardLogos: [logoMakalotMark],
    hashtags: ['#推薦系統', '#自然語言互動', '#時尚科技'],
  },
  {
    sponsor: '恩智浦半導體',
    logos: [logoNxp, logoWtMicro],
    // 「縁」是日文新字體 U+7E01，不是繁體的「緣」U+7DE3 —— 放大卡的 hashtag 用
    // Zen Antique（日文字型），而它沒有 U+7DE3 的字面，繁體寫法會單獨掉到備援字、
    // 整行只有那一個字長得不一樣（市府回報過）。實測：邊/運/算 的前進寬都是
    // 0.9961em（Zen Antique），緣 是 1.0003em（備援），改成 縁 之後回到 0.9961em。
    // 與頁面主標題「題目説明」用日文 U+8AAC 同理，設計稿本身也是這樣處理。
    // 只有走 font-zen 的 hashtag 需要這樣寫；font-noto 的地方用正常的繁體「緣」
    // 即可，不要一起改。
    hashtags: ['#實體 AI（Physical AI）', '#邊縁 AI（Edge AI）', '#機器人'],
  },
  {
    sponsor: '愛德萬測試',
    logos: [logoAdvantest],
    // 「縁」同上，日文新字體 U+7E01。理由見 NXP 那筆的註解。
    hashtags: ['#AI', '#數據分析', '#邊縁運算'],
  },
  {
    sponsor: 'Google',
    logos: [logoGoogle],
    hashtags: [
      '#AI Agent (AI智慧代理)',
      '#Multimodal Reasoning (多模態推理)',
      '#Autonomy (自治)',
    ],
  },
]
