import { useState } from 'react'

type GroupKey = 'hacker' | 'maker'

const TABS: { key: GroupKey; label: string }[] = [
  { key: 'hacker', label: '黑客組' },
  { key: 'maker', label: '創客交流組' },
]

export default function Rules() {
  const [tab, setTab] = useState<GroupKey>('hacker')

  const hackerRules = (
    <ul>
      <li>
        分為初賽與決賽（梅竹大獎），黑客組不允許採用預錄影片
        Demo取代作品展示，需以現場實際操作展現作品功能，否則不予計分。
      </li>
      <li>
        初賽由七間合作企業各自評選，選出該企業所屬隊伍的前三名
        <ul>
          <li>
            黑客組初賽前，參賽者需以組別為單位上傳簡報終稿、程式碼或其他作品連結；並且於指定時間至各企業攤位進行設備測試。
          </li>
          <li>
            初賽 Demo 時，黑客組 Demo 時間為 13 分鐘，包含 7 分鐘發表及 6
            分鐘評審 Q&A。工作人員將於發表 7
            分鐘時響短鈴一次，表示發表結束進入Q&A。進入 Q&A 環節，12.5
            分鐘響短鈴兩次，13
            分鐘響長鈴，參賽者需要馬上停止回答，否則將斟酌扣分。
          </li>
        </ul>
      </li>
      <li>
        初賽獲得第一名的七支隊伍將進入最終梅竹大獎的評選
        <ul>
          <li>梅竹大獎評選前，隊伍需於指定時間至主舞台旁進行設備測試。</li>
          <li>
            決賽 Demo 時，每組 15 分鐘，包括 8 分鐘的發表與 7 分鐘的評審
            Q&A，Demo
            若未出席則順延一組，順延後若仍未出席，則視同放棄參賽資格；6.5
            分鐘時短鈴兩次，8 分鐘時長鈴一次，進入 Q&A 環節，15
            分鐘時長鈴一次，現場將輔以大字報提醒。長鈴響起後，請評審停止提問、參賽者停止回答，Demo
            結束。
          </li>
          <li>梅竹大獎前三名由評審決定；最佳人氣獎則由現場觀眾投票產生。</li>
        </ul>
      </li>
    </ul>
  )

  const makerRules = (
    <ul>
      <li>
        創客組僅有一次 Demo，創客組接受多元形式的 Demo 與作品，唯需於比賽 Demo
        時讓評審實際操作作品。（參考工具：figma、Miro、Webflow、Sketch）
        <ul>
          <li>
            創客組 Demo
            前，參賽者需以組別為單位上傳簡報終稿、程式碼或其他作品連結；並且於指定時間至主舞台旁進行設備測試。
          </li>
          <li>
            創客組 Demo 時，每組 13 分鐘，包括 8 分鐘發表與 5 分鐘評審
            Q&A，工作人員將於發表 7 分鐘時響短鈴兩次，8
            分鐘時響長鈴一次，表示發表結束進入評審提問環節，提問採統問統答形式，評審全部提問結束後，參賽者統一回答。Q&A
            環節 5 分鐘響長鈴，響鈴後請即刻終止發言，如繼續發言將斟酌扣分。
          </li>
        </ul>
      </li>
    </ul>
  )

  return (
    <div id="rules" className="rules-section">
      <div className="rules-mobile">
        <p className="mobile-home-title">比賽規則</p>
        <div className={`rules-mobile-panel is-${tab}`}>
          <div className="rules-mobile-tabs">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={tab === key ? 'is-active' : ''}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="rules-mobile-copy">
            {tab === 'hacker' ? hackerRules : makerRules}
          </div>
        </div>
      </div>

      <div className="rules-desktop mx-auto w-full max-w-[1019px] flex-col items-center gap-12 px-6 py-16 md:gap-[90px] md:px-0">
        <p className="text-center font-['Zen_Antique'] text-2xl text-[#f6f6f6] [text-shadow:0px_0px_20px_rgba(255,255,255,0.35),0px_4px_40px_rgba(255,255,255,0.2)] md:text-[35px]">
          比賽規則
        </p>

        <div className="relative w-full md:px-[25px]">
          <div className="relative z-20 flex items-end pl-[5px] md:pl-0">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`relative flex h-[52px] cursor-pointer items-center justify-center rounded-t-[24px] px-5 text-base leading-none font-semibold transition-all duration-300 md:h-[64px] md:rounded-t-[30px] md:text-[25px] md:leading-[40px] ${
                  key === 'hacker'
                    ? 'w-[38%] md:w-[167px]'
                    : 'w-[52%] md:w-[233px]'
                } ${
                  tab === key
                    ? 'z-20 bg-[linear-gradient(to_bottom,#f1ebf7_0%,#e7dfef_52%,#d8d0e4_100%)] text-[#6c6c6c] shadow-[0_-9px_28px_rgba(255,255,255,1),-9px_0_24px_rgba(255,255,255,0.85),9px_0_24px_rgba(255,255,255,0.65),inset_0_3px_8px_rgba(255,255,255,0.95)]'
                    : 'z-0 bg-[#b1a2ca] text-white shadow-[inset_0_1px_5px_rgba(255,255,255,0.22)] hover:brightness-105'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div
            className={`relative z-10 -mt-px w-full rounded-[30px] rounded-tl-none bg-[#d8d0e4] px-6 py-10 text-justify text-[#656565] shadow-[-10px_0_24px_rgba(255,255,255,0.75),10px_0_24px_rgba(255,255,255,0.75),0_12px_0_rgba(177,162,202,0.75),0_15px_24px_rgba(0,0,0,0.28),inset_1px_0_rgba(255,255,255,0.8),inset_-1px_0_rgba(255,255,255,0.8),inset_0_-1px_rgba(255,255,255,0.8)] md:px-[47px] md:pt-[60px] md:pb-[48px] ${
              tab === 'hacker' ? 'md:min-h-[798px]' : 'md:min-h-[518px]'
            }`}
          >
            <div className="rules-desktop-copy">
              {tab === 'hacker' ? hackerRules : makerRules}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
