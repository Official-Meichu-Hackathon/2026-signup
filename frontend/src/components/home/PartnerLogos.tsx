import logoLogitech from '../../assets/home/logo-logitech.webp'
import logoAmd from '../../assets/home/logo-amd.webp'
import logoCloudMosa from '../../assets/home/logo-cloudmosa.webp'
import logoGoogle from '../../assets/home/logo-google.webp'
import logoNxp from '../../assets/home/logo-nxp.webp'
import logoAdvantest from '../../assets/home/logo-advantest.webp'
import logoEclat from '../../assets/home/logo-eclat.webp'
import logoWtmicro from '../../assets/home/logo-wtmicro.webp'
import logoTsmc from '../../assets/home/logo-tsmc.webp'
import logoPhison from '../../assets/home/logo-phison.webp'

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="partner-section-title font-zen w-full text-center text-2xl leading-[44px] font-normal text-[#b1a2ca] not-italic md:text-[35px]">
      {children}
    </p>
  )
}

function MainPartnerGrid() {
  return (
    <div className="partner-main-grid relative aspect-[812/601] w-full max-w-[812px]">
      <img
        src={logoLogitech}
        alt="Logitech"
        loading="lazy"
        decoding="async"
        className="partner-logo-logitech absolute top-0 left-0 h-[30.283%] w-[47.537%] object-cover"
      />
      <img
        src={logoAmd}
        alt="AMD"
        loading="lazy"
        decoding="async"
        className="partner-logo-amd absolute top-[10.316%] left-[58.251%] h-[11.647%] w-[36.084%] object-cover"
      />
      <img
        src={logoCloudMosa}
        alt="CloudMosa"
        loading="lazy"
        decoding="async"
        className="partner-logo-cloudmosa absolute top-[42.263%] left-[4.064%] h-[12.978%] w-[39.532%] object-cover"
      />
      <img
        src={logoGoogle}
        alt="Google"
        loading="lazy"
        decoding="async"
        className="partner-logo-google absolute top-[38.436%] left-[57.143%] h-[16.805%] w-[38.3%] object-cover"
      />
      <img
        src={logoNxp}
        alt="NXP"
        loading="lazy"
        decoding="async"
        className="partner-logo-nxp absolute top-[67.221%] left-[0.616%] h-[30.616%] w-[46.429%] object-cover"
      />
      <div className="partner-logo-advantest absolute top-[71.547%] left-[52.586%] h-[28.453%] w-[47.414%] overflow-hidden">
        <img
          src={logoAdvantest}
          alt="Advantest 愛德萬測試"
          loading="lazy"
          decoding="async"
          className="absolute top-[-195.29%] left-[-93.01%] h-[459.7%] w-[286.21%] max-w-none"
        />
      </div>
    </div>
  )
}

export default function PartnerLogos() {
  return (
    <div className="partner-sections mx-auto flex w-full max-w-[1093px] flex-col items-center px-6 pt-2 pb-[53px] md:px-0 md:pt-[130px] md:pb-[117px]">
      <div
        id="partners"
        className="partner-block partner-main flex w-full flex-col items-center"
      >
        <div className="flex w-full flex-col items-center gap-8 md:gap-[60px]">
          <SectionTitle>合作企業</SectionTitle>
          <MainPartnerGrid />
        </div>

        <img
          src={logoEclat}
          alt="聚陽實業"
          loading="lazy"
          decoding="async"
          className="partner-logo-eclat mt-10 aspect-[219.493/183] w-[100px] object-cover md:mt-[93px] md:w-[219.493px]"
        />
      </div>

      <div className="partner-block partner-special mt-12 flex w-full flex-col items-center gap-6 md:mt-[149px] md:gap-[60px]">
        <SectionTitle>特別合作企業</SectionTitle>
        <div className="partner-special-logo relative h-[123px] w-[100px] overflow-hidden md:h-[250px] md:w-[203px]">
          <img
            src={logoWtmicro}
            alt="文曄科技"
            loading="lazy"
            decoding="async"
            className="absolute top-[-43.13%] left-[-106.7%] h-[190.98%] w-[317.86%] max-w-none"
          />
        </div>
      </div>

      <div
        id="sponsors"
        className="partner-block partner-sponsors mt-16 flex w-full flex-col items-center gap-6 md:mt-[187px] md:gap-[60px]"
      >
        <SectionTitle>贊助企業</SectionTitle>
        <div className="flex w-full flex-col items-center gap-8 md:gap-[93px]">
          <div className="relative aspect-[345/228] w-full max-w-[120px] md:max-w-[345px]">
            <img
              src={logoTsmc}
              alt="TSMC 台積電"
              loading="lazy"
              decoding="async"
              className="absolute top-[8.772%] left-[5.797%] h-[84.149%] w-[88.406%] object-cover"
            />
          </div>
          <div className="relative aspect-[315/99] w-full max-w-[120px] overflow-hidden md:max-w-[315px]">
            <img
              src={logoPhison}
              alt="Phison 群聯電子"
              loading="lazy"
              decoding="async"
              className="absolute top-[-71.78%] left-[-18.03%] h-[243.45%] w-[136.03%] max-w-none"
            />
          </div>
        </div>
      </div>

      <div className="partner-block partner-placeholder mt-24 flex w-full flex-col items-center md:mt-[331px]">
        <SectionTitle>特殊贊助</SectionTitle>
      </div>

      <div className="partner-block partner-placeholder mt-20 flex w-full flex-col items-center md:mt-[113px]">
        <SectionTitle>媒體合作</SectionTitle>
      </div>
    </div>
  )
}
