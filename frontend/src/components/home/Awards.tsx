import Sparkle from './Sparkle'

function AwardCard({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <div className="relative w-full rounded-[30px] border border-[#d3e4fc] bg-gradient-to-br from-[#d3e4fc]/50 to-[#d3e4fc]/10 p-8 shadow-[0px_4px_25px_-5px_#1c1b1f] md:p-12">
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_1px_8px_0px_rgba(255,255,255,0.5)]" />
      <p className="text-2xl font-semibold text-white md:text-[30px]">
        {title}
      </p>
      {note && (
        <p className="mb-2 text-sm font-medium text-[#f6ff7b]">{note}</p>
      )}
      <div className="mt-3 text-base leading-[1.8] font-semibold text-white md:text-[20px]">
        {children}
      </div>
    </div>
  )
}

export default function Awards() {
  return (
    <div className="mx-auto flex w-full max-w-[730px] flex-col items-center gap-16 px-6 py-16 md:gap-[90px]">
      <div className="relative">
        <Sparkle
          variant="bright"
          className="-top-6 -left-10 h-10 w-10 md:-top-8 md:-left-14 md:h-14 md:w-14"
        />
        <Sparkle
          variant="soft"
          className="-top-1 -right-8 h-6 w-6 md:-right-10 md:h-8 md:w-8"
        />
        <p className="text-center font-['Zen_Antique'] text-2xl text-[#f6f6f6] [text-shadow:0px_0px_20px_rgba(255,255,255,0.35),0px_4px_40px_rgba(255,255,255,0.2)] md:text-[35px]">
          獎項資訊
        </p>
      </div>

      <div className="flex w-full flex-col gap-10 md:gap-[70px]">
        <AwardCard title="黑客組" note="每間企業獨立評選">
          <p>第一名：新台幣 25,000 元整、企業實體獎品、實習或實習面試機會</p>
          <p>第二名：新台幣 20,000 元整、企業實體獎品</p>
          <p>第三名：新台幣 15,000 元整、企業實體獎品</p>
          <p className="mt-2 text-sm font-medium text-[#f6ff7b]">
            *實習機會主要依據企業本身而定
          </p>
        </AwardCard>

        <AwardCard title="創客交流組">
          <div className="grid grid-cols-1 gap-x-16 gap-y-1 sm:grid-cols-2">
            <div>
              <p>第一名：新台幣 50,000 元整</p>
              <p>第二名：新台幣 40,000 元整</p>
              <p>第三名：新台幣 30,000 元整</p>
            </div>
            <div>
              <p>創意獎一：新台幣 12,000 元整</p>
              <p>創意獎二：新台幣 10,000 元整</p>
              <p>創意獎三：新台幣 8,000 元整</p>
            </div>
          </div>
        </AwardCard>

        <AwardCard
          title="梅竹大獎"
          note="為黑客組複賽，由各間企業之第一名獲獎組別共同角逐"
        >
          <p>第一名：新台幣 30,000 元整</p>
          <p>第二名：新台幣 16,000 元整</p>
          <p>第三名：新台幣 8,000 元整</p>
          <p>最佳人氣獎：新台幣 3,000 元整</p>
        </AwardCard>
      </div>

      <a
        href="/register"
        className="flex h-[70px] w-full max-w-[358px] items-center justify-center rounded-[30px] border border-[rgba(211,228,252,0.8)] bg-[rgba(138,153,174,0.15)] text-2xl font-black text-[#b1a2ca] shadow-[0px_4px_20px_-1px_rgba(28,27,31,0.6)] transition-colors hover:bg-[rgba(138,153,174,0.3)] md:text-[32px]"
      >
        點我報名
      </a>
    </div>
  )
}
