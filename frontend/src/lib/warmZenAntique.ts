import { PROBLEMS, HASHTAG_NOTE } from '../data/problems'

// Google Fonts 把 Zen Antique 切成 122 個 unicode-range subset，瀏覽器只有在「真的
// 要畫到那個字」時才會去抓對應的 subset。配上 display=swap，那個字會先用備援字畫
// 出來、subset 到了才換 —— 中間那段空窗期裡，同一行字會有一兩個字長得不一樣。
//
// 最明顯的是 NXP 的「#邊緣 AI」與愛德萬的「#邊緣運算」：整站只有這兩處會用到
// 「緣」U+7DE3，它獨佔一個 subset，那個請求要等到使用者點開放大卡、文字第一次繪製
// 時才發出，所以幾乎一定會被看到換字前的樣子（市府就是這樣回報的）。「閱讀完畢」
// 的「閱」U+95B1 也是同一個情況。
//
// 這裡在 App 啟動時就把整站會用到的 Zen Antique 字元一次要求載入，subset 因此在
// 使用者點開任何卡片之前就下載完畢，不會再看到換字。字串直接從資料來源組出來，
// 之後改 hashtag 或加企業都會自動跟上，不需要手動維護清單。
//
// 這是「提早載入」而不是「補缺字」—— Zen Antique 本身這些字面都有（可用
// document.fonts 的 unicodeRange 驗證）。index.css 那邊補的 Noto Serif TC 備援是
// 另一層保險，負責在 subset 還沒到、或日後出現真正缺字時，讓備援至少是同類的繁體
// 襯線字，而不是各作業系統各自的預設字。
const STATIC_ZEN_TEXT = [
  // 各頁主標題與共用文案
  '題目説明',
  '參賽數據',
  '比賽時程',
  '報名尚未開始',
  '閱讀完畢',
  '完整題目將於當天公告',
  // 創客交流組面板
  '創客交流組',
  'CLICK！',
  '2026',
  '新竹X梅竹黑客松',
  // 參賽數據頁
  '梅竹黑客松參賽數據',
  '參賽者感言',
  '成果平台網址',
].join('')

export function warmZenAntique() {
  if (!document.fonts?.load) return

  const text = [
    STATIC_ZEN_TEXT,
    HASHTAG_NOTE,
    PROBLEMS.flatMap((problem) => problem.hashtags).join(''),
    PROBLEMS.map((problem) => problem.sponsor).join(''),
  ].join('')

  // 去重只是為了讓請求的字元清單短一點；load() 本身不在意重複。
  const unique = [...new Set(text.split(''))].join('')

  // 失敗不影響畫面（頂多退回原本的延後載入），所以只吞掉錯誤、不往上拋。
  void document.fonts.load(`400 1rem 'Zen Antique'`, unique).catch(() => {})
}
