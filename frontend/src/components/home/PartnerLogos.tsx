import logoLogitech from '../../assets/home/logo-logitech.png'
import logoAmd from '../../assets/home/logo-amd.png'
import logoCloudMosa from '../../assets/home/logo-cloudmosa.png'
import logoGoogle from '../../assets/home/logo-google.png'
import logoNxp from '../../assets/home/logo-nxp.png'
import logoAdvantest from '../../assets/home/logo-advantest.png'
import logoEclat from '../../assets/home/logo-eclat.png'
import logoWtmicro from '../../assets/home/logo-wtmicro.png'
import logoTsmc from '../../assets/home/logo-tsmc.png'
import logoPhison from '../../assets/home/logo-phison.png'

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-center font-['Zen_Antique'] text-2xl text-[#b1a2ca] [text-shadow:0px_0px_20px_rgba(255,255,255,0.35),0px_4px_40px_rgba(255,255,255,0.2)] md:text-[35px]">
      {children}
    </p>
  )
}

function LogoGrid({ logos }: { logos: { src: string; alt: string }[] }) {
  return (
    <div className="grid w-full grid-cols-2 items-center justify-items-center gap-x-10 gap-y-12 md:grid-cols-2 md:gap-x-24 md:gap-y-16">
      {logos.map((logo) => (
        <img
          key={logo.alt}
          src={logo.src}
          alt={logo.alt}
          className="h-16 w-full max-w-[220px] object-contain md:h-24"
        />
      ))}
    </div>
  )
}

function ComingSoon() {
  return <p className="py-6 text-center text-black/30">尚無資料，敬請期待</p>
}

export default function PartnerLogos() {
  return (
    <div className="mx-auto flex w-full max-w-[1093px] flex-col items-center gap-20 px-6 py-16 md:gap-[90px]">
      <div
        id="partners"
        className="flex w-full flex-col items-center gap-12 md:gap-[90px]"
      >
        <SectionTitle>合作企業</SectionTitle>
        <LogoGrid
          logos={[
            { src: logoLogitech, alt: 'Logitech' },
            { src: logoAmd, alt: 'AMD' },
            { src: logoCloudMosa, alt: 'CloudMosa' },
            { src: logoGoogle, alt: 'Google' },
            { src: logoNxp, alt: 'NXP' },
            { src: logoAdvantest, alt: 'Advantest 愛德萬測試' },
            { src: logoEclat, alt: '聚陽實業' },
          ]}
        />
      </div>

      <div className="flex w-full flex-col items-center gap-12 md:gap-[90px]">
        <SectionTitle>特別合作企業</SectionTitle>
        <img src={logoWtmicro} alt="文曄科技" className="h-40 object-contain" />
      </div>

      <div
        id="sponsors"
        className="flex w-full flex-col items-center gap-12 md:gap-[90px]"
      >
        <SectionTitle>贊助企業</SectionTitle>
        <LogoGrid
          logos={[
            { src: logoTsmc, alt: 'TSMC 台積電' },
            { src: logoPhison, alt: 'Phison 群聯電子' },
          ]}
        />
      </div>

      <div className="flex w-full flex-col items-center gap-6">
        <SectionTitle>特殊贊助</SectionTitle>
        <ComingSoon />
      </div>

      <div className="flex w-full flex-col items-center gap-6">
        <SectionTitle>媒體合作</SectionTitle>
        <ComingSoon />
      </div>
    </div>
  )
}
