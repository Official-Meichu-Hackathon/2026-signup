// 黑客組企業題目 — 內容取自 Figma「題目說明電腦版_黑客組_未公開2」
// （1601:61961）的 zoomin1–7 變體。
import logoCloudMosa from '../assets/Problems/logo-cloudmosa.png'
import logoLogitech from '../assets/Problems/logo-logitech.png'
import logoAmdItri from '../assets/Problems/logo-amd-itri.png'
import logoMakalot from '../assets/Problems/logo-makalot.png'
import logoNxp from '../assets/Problems/logo-nxp.png'
import logoWtMicro from '../assets/Problems/logo-wtmicro.png'
import logoAdvantest from '../assets/Problems/logo-advantest.png'
import logoGoogle from '../assets/Problems/logo-google.png'

// 題目全文於比賽當天另行公布，網站上一律只放 hashtag 提示，沒有公開/未公開
// 之分。paragraphs 保留各企業的題目全文備用，目前不會顯示。
export const HASHTAG_NOTE = '完整題目將於比賽當日公開'

// hashtag 佔位。設計稿是「#......」，聚陽、恩智浦、愛德萬、CloudMosa 尚未
// 提供實際內容，先用佔位；主辦給了之後替換各企業的 hashtags。
const HASHTAG_PLACEHOLDER = ['#......', '#......', '#......']

export interface Problem {
  sponsor: string
  logos: string[]
  // 比賽前的提示標籤。內容確定前用 HASHTAG_PLACEHOLDER。
  hashtags: string[]
  // 保密協定說明，只有部分企業有（如羅技）。設計稿放在企業名與分隔線之間。
  note?: string
  // 題目全文，備用，目前不顯示。
  paragraphs: string[]
}

export const PROBLEMS: Problem[] = [
  {
    sponsor: 'CloudMosa',
    logos: [logoCloudMosa],
    hashtags: HASHTAG_PLACEHOLDER,
    paragraphs: [
      '透過 CloudMosa 提供之 Cloud Phone，開發一款具備完整功能與良好體驗的應用程式，並用以提升教育學習、資訊查詢、實用工具應用、天氣預報等服務品質，改變偏遠地區與第三世界國家的生活樣態，讓現代網路服務能走進每個人的生活。',
    ],
  },
  {
    sponsor: '羅技',
    logos: [logoLogitech],
    hashtags: ['#AICopilot', '#FutureOfWork', '#AIGaming', '#PlayToWin'],
    note: '請務必簽署附件之保密協定，並於回傳組別繳費證明的郵件的同時，一併繳交個人的保密協定同意書，方為報名成功。',
    paragraphs: [
      '在三個子題中，打造沉浸式的使用者體驗。',
      '包括：打造增加使用者互動的 AI 工具如動態遊戲助手、永續發展人工智慧、情境感知使用者界面或自適應性能優化器；3D桌面互動概念，透過網路攝影機、空間輸入和顯示創新來增加數位工作流程；多模態介面，結合 AR/VR、手勢、語音和行動裝置、實現統一的使用者參與。',
      '請務必簽署附件之保密協定，並於回傳組別繳費證明的郵件的同時，一併繳交個人的保密協定同意書，方為報名成功。',
    ],
  },
  {
    sponsor: 'AMD',
    logos: [logoAmdItri],
    hashtags: ['#PhysicalAI', '#Cloud-to-Edge AI Deployment', '#Robotics'],
    paragraphs: [
      'AMD 將提供每組一台 AI PC Laptop (ASUS M5606W HX370/0001DA/32G/T)，請運用本地算力，開發能夠協助生活的 AI Agent。',
      '在旅遊規劃、自動發文、個人活安排或校園活動整合中，創造一個更加便利的生活模式。你將利用 Lemonade server 來發揮 Ryzen AI PC 的潛力，並通過串流工具，將其連接到 Hugging Face 的 Tiny Agents 等內容，打造多樣的 AI Agents。',
    ],
  },
  {
    sponsor: '聚陽實業股份有限公司',
    logos: [logoMakalot],
    hashtags: HASHTAG_PLACEHOLDER,
    paragraphs: [],
  },
  {
    sponsor: '恩智浦半導體',
    logos: [logoNxp, logoWtMicro],
    hashtags: HASHTAG_PLACEHOLDER,
    paragraphs: [
      '善用邊緣運算與人工智慧、結合語音影像等感測辨識，兼顧功能與資訊安全，打造具即時反應的智慧創新應用。',
      '例如，使用 FRDM i.MX93 開發板做為感測中心，以 Wi-Fi 方式連接各式感測器(如:攝影鏡頭)，進行物品辨識以判斷物品是否正常運作。這些感測器資料可以結合在一起，透過大數據、AI 演算法,做出更多不同的應用，亦可連接到手機 APP 控制，相關資料在各設備間的連結，可透過 IW416 Wi-Fi 進行安全傳輸。',
    ],
  },
  {
    sponsor: '愛德萬測試',
    logos: [logoAdvantest],
    hashtags: HASHTAG_PLACEHOLDER,
    paragraphs: [],
  },
  {
    sponsor: 'Google',
    logos: [logoGoogle],
    hashtags: [
      '#AI Agent (AI智慧代理)',
      '#Multimodal Reasoning (多模態推理)',
      '#Autonomy (自治)',
    ],
    paragraphs: [
      '運用 Gemini 模型，發揮創意，將智慧應用帶入每個人的手機中。',
      '例如，即時語音描述路況系統、處理複雜文件內容、結合手機鏡頭辨識垃圾種類、電話詐騙預防系統等等。在手機的應用場景上，使用指定模型、結合其他輔助領域之技術，解決真實世界的問題，提升弱勢社群的無障礙體驗。',
    ],
  },
]
