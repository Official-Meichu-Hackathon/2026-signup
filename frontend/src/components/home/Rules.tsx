import { useState } from 'react'
import rulesHackerActive from '../../assets/home/rules-hacker-active.svg'
import rulesHackerBase from '../../assets/home/rules-hacker-base.svg'
import rulesMakerActive from '../../assets/home/rules-maker-active.svg'
import rulesMakerBase from '../../assets/home/rules-maker-base.svg'

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
        時讓評審實際操作作品。
        <p>（參考工具：figma、Miro、Webflow、Sketch）</p>
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
    <div
      id="rules"
      className="rules-section md:mt-[108px] md:px-[clamp(48px,8vw,96px)]"
    >
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

      <div className="rules-desktop mx-auto w-full max-w-[1083px] flex-col items-center gap-12 py-16 md:gap-[90px] md:py-0">
        <p className="text-center font-['Zen_Antique'] text-2xl text-[#f6f6f6] [text-shadow:0px_0px_20px_rgba(255,255,255,0.35),0px_4px_40px_rgba(255,255,255,0.2)] md:text-[35px] md:leading-[44px]">
          比賽規則
        </p>

        <div
          className={`relative w-full overflow-visible transition-[min-height] duration-300 ${
            tab === 'hacker' ? 'min-h-[908px]' : 'min-h-[634px]'
          }`}
        >
          {tab === 'hacker' ? (
            <>
              <div
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
              >
                <img
                  src={rulesHackerBase}
                  alt=""
                  className="absolute top-[86px] left-[19px] h-[calc(100%-110px)] w-[calc(100%-49px)] max-w-none"
                />
                <div className="absolute top-[86px] left-[19px] h-[calc(100%-110px)] w-[calc(100%-49px)] rounded-tr-[40px] rounded-b-[40px] bg-[#d8d0e4] shadow-[0_0_24px_rgba(255,255,255,0.9),0_8px_0_rgba(177,162,202,0.65),0_14px_28px_rgba(0,0,0,0.28),inset_1px_0_rgba(255,255,255,0.72),inset_-1px_0_rgba(255,255,255,0.72),inset_0_-1px_rgba(255,255,255,0.72)]" />
                <div className="absolute top-[24px] left-[19px] h-[63px] w-[167px] rounded-t-[30px] bg-[#d8d0e4]" />
                <div className="absolute top-[24px] left-[184px] h-[63px] w-[233px] rounded-t-[30px] bg-[#b1a2ca]" />
                <div
                  className="absolute top-[-22px] left-[-31px] h-[160px] w-[215px] overflow-hidden"
                  style={{
                    maskImage:
                      'linear-gradient(to bottom, black 0%, black 48%, rgba(0,0,0,0.65) 68%, transparent 96%, transparent 100%), linear-gradient(to right, black 0%, black 80%, rgba(0,0,0,0.7) 90%, transparent 100%)',
                    maskComposite: 'intersect',
                    WebkitMaskImage:
                      'linear-gradient(to bottom, black 0%, black 48%, rgba(0,0,0,0.65) 68%, transparent 96%, transparent 100%), linear-gradient(to right, black 0%, black 80%, rgba(0,0,0,0.7) 90%, transparent 100%)',
                    WebkitMaskComposite: 'source-in',
                  }}
                >
                  <img
                    src={rulesHackerActive}
                    alt=""
                    className="absolute top-0 left-0 h-[960px] w-[1070px] max-w-none"
                  />
                </div>
              </div>

              <button
                type="button"
                aria-pressed="true"
                onClick={() => setTab('hacker')}
                className="absolute top-[24px] left-[19px] z-20 flex h-[64px] w-[167px] cursor-pointer items-center justify-center rounded-t-[30px] text-[25px] leading-[40px] font-semibold text-[#6c6c6c] focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white/80"
              >
                黑客組
              </button>
              <button
                type="button"
                aria-pressed="false"
                onClick={() => setTab('maker')}
                className="absolute top-[24px] left-[184px] z-20 flex h-[63px] w-[233px] cursor-pointer items-center justify-center rounded-t-[30px] text-[25px] leading-[40px] font-semibold text-white transition-[filter] hover:brightness-110 focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white/80"
              >
                創客交流組
              </button>
            </>
          ) : (
            <>
              <div
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
              >
                <img
                  src={rulesMakerBase}
                  alt=""
                  className="absolute top-[85px] left-[25px] h-[calc(100%-117px)] w-[calc(100%-49px)] max-w-none"
                />
                <div className="absolute top-[85px] left-[25px] h-[calc(100%-117px)] w-[calc(100%-49px)] rounded-tr-[40px] rounded-b-[40px] bg-[#d8d0e4] shadow-[0_0_24px_rgba(255,255,255,0.9),0_8px_0_rgba(177,162,202,0.65),0_14px_28px_rgba(0,0,0,0.28),inset_1px_0_rgba(255,255,255,0.72),inset_-1px_0_rgba(255,255,255,0.72),inset_0_-1px_rgba(255,255,255,0.72)]" />
                <div className="absolute top-[23px] left-[25px] h-[63px] w-[167px] rounded-t-[30px] bg-[#b1a2ca]" />
                <div className="absolute top-[22px] left-[192px] h-[64px] w-[233px] rounded-t-[30px] bg-[#d8d0e4]" />
                <div
                  className="absolute top-[-24px] left-[130px] h-[120px] w-[340px] overflow-hidden"
                  style={{
                    maskImage:
                      'linear-gradient(to bottom, black 0%, black 48%, rgba(0,0,0,0.65) 68%, transparent 92%, transparent 100%), linear-gradient(to right, black 0%, black 84%, rgba(0,0,0,0.7) 90%, transparent 100%)',
                    maskComposite: 'intersect',
                    WebkitMaskImage:
                      'linear-gradient(to bottom, black 0%, black 48%, rgba(0,0,0,0.65) 68%, transparent 92%, transparent 100%), linear-gradient(to right, black 0%, black 84%, rgba(0,0,0,0.7) 90%, transparent 100%)',
                    WebkitMaskComposite: 'source-in',
                  }}
                >
                  <img
                    src={rulesMakerActive}
                    alt=""
                    className="absolute top-0 left-[-155px] h-[680px] w-[1070px] max-w-none"
                  />
                </div>
              </div>

              <button
                type="button"
                aria-pressed="false"
                onClick={() => setTab('hacker')}
                className="absolute top-[23px] left-[25px] z-20 flex h-[63px] w-[167px] cursor-pointer items-center justify-center rounded-t-[30px] text-[25px] leading-[40px] font-semibold text-white transition-[filter] hover:brightness-110 focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white/80"
              >
                黑客組
              </button>
              <button
                type="button"
                aria-pressed="true"
                onClick={() => setTab('maker')}
                className="absolute top-[22px] left-[192px] z-20 flex h-[64px] w-[233px] cursor-pointer items-center justify-center rounded-t-[30px] text-[25px] leading-[40px] font-semibold text-[#6c6c6c] focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white/80"
              >
                創客交流組
              </button>
            </>
          )}

          <div className="rules-desktop-copy relative z-10 mx-[clamp(48px,6.77%,69px)] pt-[148px] pb-[74px] text-justify text-[#656565]">
            {tab === 'hacker' ? hackerRules : makerRules}
          </div>
        </div>
      </div>
    </div>
  )
}
