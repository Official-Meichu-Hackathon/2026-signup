// 黑客組企業題目 — 內容取自 Figma「題目說明電腦版_黑客組」zoomin1–7 變體。
// 聚陽實業、愛德萬測試的題目內文設計稿尚未提供，先留空陣列。
import logoCloudMosa from '../assets/Problems/logo-cloudmosa.png'
import logoLogitech from '../assets/Problems/logo-logitech.png'
import logoAmdItri from '../assets/Problems/logo-amd-itri.png'
import logoMakalot from '../assets/Problems/logo-makalot.png'
import logoNxp from '../assets/Problems/logo-nxp.png'
import logoWtMicro from '../assets/Problems/logo-wtmicro.png'
import logoAdvantest from '../assets/Problems/logo-advantest.png'
import logoGoogle from '../assets/Problems/logo-google.png'

// 題目是否已公布。false 時整頁走設計稿的「未公開」版本（664:1564）：
// 收合牌堆的白卡不放 logo 也不放提示、點卡片顯示「尚未公開」而非題目內容、
// 創客交流組也顯示「尚未公開」。題目公布後改成 true 即可。
export const PROBLEMS_PUBLISHED = false

export interface Problem {
  sponsor: string
  logos: string[]
  paragraphs: string[]
}

export const PROBLEMS: Problem[] = [
  {
    sponsor: 'CloudMosa',
    logos: [logoCloudMosa],
    paragraphs: [
      '透過 CloudMosa 提供之 Cloud Phone，開發一款具備完整功能與良好體驗的應用程式，並用以提升教育學習、資訊查詢、實用工具應用、天氣預報等服務品質，改變偏遠地區與第三世界國家的生活樣態，讓現代網路服務能走進每個人的生活。',
    ],
  },
  {
    sponsor: '羅技',
    logos: [logoLogitech],
    paragraphs: [
      '在三個子題中，打造沉浸式的使用者體驗。',
      '包括：打造增加使用者互動的 AI 工具如動態遊戲助手、永續發展人工智慧、情境感知使用者界面或自適應性能優化器；3D桌面互動概念，透過網路攝影機、空間輸入和顯示創新來增加數位工作流程；多模態介面，結合 AR/VR、手勢、語音和行動裝置、實現統一的使用者參與。',
      '請務必簽署附件之保密協定，並於回傳組別繳費證明的郵件的同時，一併繳交個人的保密協定同意書，方為報名成功。',
    ],
  },
  {
    sponsor: 'AMD',
    logos: [logoAmdItri],
    paragraphs: [
      'AMD 將提供每組一台 AI PC Laptop (ASUS M5606W HX370/0001DA/32G/T)，請運用本地算力，開發能夠協助生活的 AI Agent。',
      '在旅遊規劃、自動發文、個人活安排或校園活動整合中，創造一個更加便利的生活模式。你將利用 Lemonade server 來發揮 Ryzen AI PC 的潛力，並通過串流工具，將其連接到 Hugging Face 的 Tiny Agents 等內容，打造多樣的 AI Agents。',
    ],
  },
  {
    sponsor: '聚陽實業股份有限公司',
    logos: [logoMakalot],
    paragraphs: [],
  },
  {
    sponsor: '恩智浦半導體',
    logos: [logoNxp, logoWtMicro],
    paragraphs: [
      '善用邊緣運算與人工智慧、結合語音影像等感測辨識，兼顧功能與資訊安全，打造具即時反應的智慧創新應用。',
      '例如，使用 FRDM i.MX93 開發板做為感測中心，以 Wi-Fi 方式連接各式感測器(如:攝影鏡頭)，進行物品辨識以判斷物品是否正常運作。這些感測器資料可以結合在一起，透過大數據、AI 演算法,做出更多不同的應用，亦可連接到手機 APP 控制，相關資料在各設備間的連結，可透過 IW416 Wi-Fi 進行安全傳輸。',
    ],
  },
  {
    sponsor: '愛德萬測試',
    logos: [logoAdvantest],
    paragraphs: [],
  },
  {
    sponsor: 'Google',
    logos: [logoGoogle],
    paragraphs: [
      '運用 Gemini 模型，發揮創意，將智慧應用帶入每個人的手機中。',
      '例如，即時語音描述路況系統、處理複雜文件內容、結合手機鏡頭辨識垃圾種類、電話詐騙預防系統等等。在手機的應用場景上，使用指定模型、結合其他輔助領域之技術，解決真實世界的問題，提升弱勢社群的無障礙體驗。',
    ],
  },
]
