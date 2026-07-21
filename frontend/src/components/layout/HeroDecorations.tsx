// Decorative meteor streaks + 4-point stars around the 報名黑客松 hero title.
// Purely decorative (aria-hidden). Two variants: mobile and desktop.
// variant="success" shifts the mobile sparkles: 流星1 up, the rest down.
export default function HeroDecorations({
  variant = 'form',
}: {
  variant?: 'form' | 'success'
}) {
  const success = variant === 'success'
  return (
    <>
      {/* Mobile hero decorations — the 5 流星 (流星1-4 + 流星線) around the title.
          Positions are rem offsets from the title centre. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-visible select-none md:hidden"
      >
        {/* 流星線 — streak sweeping under the title's lower-left */}
        <img
          src="/deco/meteor-line.svg"
          alt=""
          draggable={false}
          className={`absolute top-1/2 left-1/2 ${success ? 'mt-[4.8rem]' : 'mt-[2.8rem]'} -ml-[4.7rem] w-[11rem] -translate-x-1/2 -translate-y-1/2`}
        />
        {/* 流星1 — large sparkle far right, just above centre */}
        <img
          src="/deco/meteor-dot.svg"
          alt=""
          draggable={false}
          className={`twinkle absolute top-1/2 left-1/2 ${success ? '-mt-[3.5rem]' : '-mt-[1.5rem]'} ml-[8.3rem] w-[3.08rem] -translate-x-1/2 -translate-y-1/2`}
          style={{ animation: 'twinkle 3.6s ease-in-out infinite 0.2s' }}
        />
        {/* 流星3 — mid sparkle far left, at title height */}
        <img
          src="/deco/meteor-dot.svg"
          alt=""
          draggable={false}
          className={`twinkle absolute top-1/2 left-1/2 ${success ? 'mt-[3.3rem]' : 'mt-[1.3rem]'} -ml-[10.4rem] w-[2.28rem] -translate-x-1/2 -translate-y-1/2`}
          style={{ animation: 'twinkle 4.1s ease-in-out infinite 1.1s' }}
        />
        {/* 流星2 — small sparkle left of centre */}
        <img
          src="/deco/meteor-dot.svg"
          alt=""
          draggable={false}
          className={`twinkle absolute top-1/2 left-1/2 ${success ? 'mt-[2.72rem]' : 'mt-[0.72rem]'} -ml-[9.7rem] w-[1.39rem] -translate-x-1/2 -translate-y-1/2`}
          style={{ animation: 'twinkle 5s ease-in-out infinite 0.6s' }}
        />
        {/* 流星4 — small sparkle just right of centre, below the streak */}
        <img
          src="/deco/meteor-dot.svg"
          alt=""
          draggable={false}
          className={`twinkle absolute top-1/2 left-1/2 ${success ? 'mt-[4.85rem]' : 'mt-[2.85rem]'} ml-[1.2rem] w-[1.39rem] -translate-x-1/2 -translate-y-1/2`}
          style={{ animation: 'twinkle 3.2s ease-in-out infinite 1.6s' }}
        />
      </div>

      {/* Desktop hero decorations */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden overflow-visible select-none md:block"
      >
        {/* faint sparkle cluster (left trio) drifting beside the title.
            The upper-right pair was split out into sparkle-pair.svg below so it
            can be positioned independently; margins move each in screen space
            (they're applied pre-rotation), so this one keeps the left text gap. */}
        <img
          src="/deco/sparkle-cluster.svg"
          alt=""
          draggable={false}
          className="twinkle-soft absolute top-1/2 left-1/2 -mt-[1.625rem] -ml-[5rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rotate-[110deg] opacity-60"
          style={{ animation: 'twinkle-soft 6s ease-in-out infinite' }}
        />
        {/* upper-right sparkle pair (big + small), split from the cluster so it
            can sit further up/right without dragging the left sparkles */}
        <img
          src="/deco/sparkle-pair.svg"
          alt=""
          draggable={false}
          className="twinkle-soft absolute top-1/2 left-1/2 -mt-[5rem] -ml-[2rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rotate-[110deg] opacity-60"
          style={{ animation: 'twinkle-soft 6s ease-in-out infinite 0.4s' }}
        />
        {/* meteor streak sweeping in under the title */}
        <img
          src="/deco/meteor-line.svg"
          alt=""
          draggable={false}
          className="absolute top-1/2 left-1/2 mt-[6.875rem] -ml-[10.75rem] w-[23.125rem] -translate-x-1/2 -translate-y-1/2 rotate-[5deg]"
        />
        {/* small meteor just right of centre */}
        <img
          src="/deco/meteor-dot.svg"
          alt=""
          draggable={false}
          className="twinkle absolute top-1/2 left-1/2 mt-[7.8125rem] ml-[1.25rem] w-[3.75rem] -translate-x-1/2 -translate-y-1/2"
          style={{ animation: 'twinkle 5.5s ease-in-out infinite 0.3s' }}
        />
        {/* bright 4-point star on the right — shadow lives on the un-rotated
          wrapper so it drops straight down; the img alone carries the rotation */}
        <div className="absolute top-1/2 right-[2%] translate-y-[1rem] drop-shadow-[0_10px_4px_rgba(0,0,0,0.25)]">
          <img
            src="/deco/star-02.png"
            alt=""
            draggable={false}
            className="twinkle w-[6.25rem] -rotate-[120deg]"
            style={{ animation: 'twinkle 3.6s ease-in-out infinite 0.7s' }}
          />
        </div>
        {/* upper-left star hugging the title (Figma 894:10448) */}
        <img
          src="/deco/star-03.png"
          alt=""
          draggable={false}
          className="twinkle absolute top-1/2 left-[7%] w-[72.849px] -translate-y-[17.5rem] rotate-[-10deg] drop-shadow-[0_10px_4px_rgba(0,0,0,0.25)]"
          style={{ animation: 'twinkle 3s ease-in-out infinite' }}
        />
        {/* small lower-left star (Figma 1757:87510) */}
        <div className="absolute top-1/2 left-[7%] translate-y-[19rem] drop-shadow-[0_10px_4px_rgba(0,0,0,0.25)]">
          <img
            src="/deco/star-02.png"
            alt=""
            draggable={false}
            className="twinkle w-[2.42rem] -rotate-[15deg]"
            style={{ animation: 'twinkle 4.4s ease-in-out infinite 1.2s' }}
          />
        </div>
      </div>
    </>
  )
}
