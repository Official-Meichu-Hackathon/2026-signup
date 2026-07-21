// Full-page dark nebula backdrop, CSS-only (2025 used the same blurred-div
// trick for halos). Swap for an exported webp if the design team needs
// pixel-exact clouds.
export default function NebulaBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black"
    >
      <div className="absolute top-[-10%] left-[-15%] h-[55vh] w-[45vw] rounded-full bg-[#3D53C5] opacity-70 blur-[120px]" />
      <div className="absolute top-[5%] right-[-10%] h-[40vh] w-[35vw] rounded-full bg-[#8FA8E8] opacity-50 blur-[130px]" />
      <div className="absolute top-[30%] left-[20%] h-[30vh] w-[25vw] rounded-full bg-[#EFD7E5] opacity-30 blur-[140px]" />
      <div className="absolute bottom-[-15%] left-[-10%] h-[50vh] w-[40vw] rounded-full bg-[#4A5CD0] opacity-60 blur-[130px]" />
      <div className="absolute right-[-15%] bottom-[-5%] h-[55vh] w-[45vw] rounded-full bg-[#AFC3F0] opacity-50 blur-[120px]" />
      <div className="absolute right-[15%] bottom-[10%] h-[25vh] w-[20vw] rounded-full bg-[#F4DAE1] opacity-40 blur-[130px]" />
    </div>
  )
}
