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
import logoMaicoin from '../../assets/home/logo-maicoin.webp'
import logoPixart from '../../assets/home/logo-pixart.webp'
import logoCathay from '../../assets/home/logo-cathay.webp'

const partnerUrls = {
  logitech: 'https://www.logitech.com/zh-tw',
  amd: 'https://developer.amd.com/ai-developer-program/',
  cloudmosa: 'https://www.cloudmosa.com/jobs',
  google:
    'https://www.google.com/about/careers/applications/jobs/results/?location=Taiwan&utm_source=partnership&utm_medium=website&utm_campaign=tw_campus_outreach&src=Online/TOPs/campus-partnership',
  nxp: 'https://www.facebook.com/nxpsemitaiwan',
  advantest: 'https://www.advantest.com/tw/',
  eclat: 'https://tw.linkedin.com/company/makalot',
} as const

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="partner-section-title font-zen w-full text-center text-2xl leading-[44px] font-normal text-[#b1a2ca] not-italic md:text-[35px]">
      {children}
    </p>
  )
}

function SponsorTierLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="sponsor-tier-label font-zen w-full text-[32px] leading-[44px] font-normal text-[#6e8eda] [text-shadow:0px_0px_20px_rgba(255,255,255,0.5),0px_4px_40px_rgba(255,255,255,0.5),0px_4px_50px_rgba(255,255,255,0.5)]">
      {children}
    </p>
  )
}

function MainPartnerGrid() {
  return (
    <div className="partner-main-grid relative aspect-[812/601] w-full max-w-[812px]">
      <a
        href={partnerUrls.logitech}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="前往 Logitech 羅技網站"
        className="partner-logo-logitech absolute top-0 left-0 h-[30.283%] w-[47.537%] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6e8eda]"
      >
        <img
          src={logoLogitech}
          alt="Logitech"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </a>
      <a
        href={partnerUrls.amd}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="前往 AMD AI Developer Program"
        className="partner-logo-amd absolute top-[10.316%] left-[58.251%] h-[11.647%] w-[36.084%] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6e8eda]"
      >
        <img
          src={logoAmd}
          alt="AMD"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </a>
      <a
        href={partnerUrls.cloudmosa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="前往 CloudMosa 徵才網站"
        className="partner-logo-cloudmosa absolute top-[42.263%] left-[4.064%] h-[12.978%] w-[39.532%] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6e8eda]"
      >
        <img
          src={logoCloudMosa}
          alt="CloudMosa"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </a>
      <a
        href={partnerUrls.google}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="前往 Google 台灣職缺網站"
        className="partner-logo-google absolute top-[38.436%] left-[57.143%] h-[16.805%] w-[38.3%] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6e8eda]"
      >
        <img
          src={logoGoogle}
          alt="Google"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </a>
      <a
        href={partnerUrls.nxp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="前往 NXP Taiwan Facebook 專頁"
        className="partner-logo-nxp absolute top-[67.221%] left-[0.616%] h-[30.616%] w-[46.429%] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6e8eda]"
      >
        <img
          src={logoNxp}
          alt="NXP"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </a>
      <a
        href={partnerUrls.advantest}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="前往 Advantest 愛德萬測試網站"
        className="partner-logo-advantest absolute top-[71.547%] left-[52.586%] h-[28.453%] w-[47.414%] overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6e8eda]"
      >
        <img
          src={logoAdvantest}
          alt="Advantest 愛德萬測試"
          loading="lazy"
          decoding="async"
          className="absolute top-[-195.29%] left-[-93.01%] h-[459.7%] w-[286.21%] max-w-none"
        />
      </a>
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

        <a
          href={partnerUrls.eclat}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="前往聚陽實業 LinkedIn 專頁"
          className="partner-logo-eclat mt-10 block aspect-[219.493/183] w-[100px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6e8eda] md:mt-[93px] md:w-[219.493px]"
        >
          <img
            src={logoEclat}
            alt="聚陽實業"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </a>
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
        className="partner-block partner-sponsors mt-16 flex w-full flex-col items-center gap-6 md:mt-[187px] md:max-w-[617px] md:gap-[60px]"
      >
        <SectionTitle>贊助企業</SectionTitle>
        <div className="sponsor-tier-list flex w-full flex-col items-center gap-[87px]">
          <div className="sponsor-tier sponsor-tier-tsmc flex w-[305px] flex-col items-start">
            <SponsorTierLabel>Gold</SponsorTierLabel>
            <div className="relative aspect-[2100/1321] w-full">
              <img
                src={logoTsmc}
                alt="TSMC 台積電"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full max-w-none object-cover"
              />
            </div>
          </div>

          <div className="sponsor-tier sponsor-tier-maicoin flex w-[347px] flex-col items-start">
            <SponsorTierLabel>Silver</SponsorTierLabel>
            <div className="relative aspect-[1734/375] w-full">
              <img
                src={logoMaicoin}
                alt="MaiCoin"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full max-w-none object-cover"
              />
            </div>
          </div>

          <div className="sponsor-tier sponsor-tier-pixart flex w-full flex-col items-start gap-[3px]">
            <SponsorTierLabel>Silver</SponsorTierLabel>
            <div className="relative aspect-[2472/308] w-full">
              <img
                src={logoPixart}
                alt="PixArt 原相科技"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full max-w-none object-cover"
              />
            </div>
          </div>

          <div className="sponsor-tier sponsor-tier-phison flex w-[315px] flex-col items-start">
            <SponsorTierLabel>Bronze</SponsorTierLabel>
            <div className="relative aspect-[3010/946] w-full">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
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
        </div>

        <div className="sponsor-tier sponsor-tier-cathay flex w-[411px] flex-col items-start">
          <SponsorTierLabel>Platinum</SponsorTierLabel>
          <div className="relative aspect-[4096/1458] w-full">
            <img
              src={logoCathay}
              alt="國泰金控 Cathay Financial Holdings"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full max-w-none object-cover"
            />
          </div>
        </div>
      </div>

      <div className="partner-block partner-placeholder mt-24 flex w-full flex-col items-center md:mt-[113px]">
        <SectionTitle>特殊贊助</SectionTitle>
      </div>

      <div className="partner-block partner-placeholder mt-20 flex w-full flex-col items-center md:mt-[113px]">
        <SectionTitle>媒體合作</SectionTitle>
      </div>
    </div>
  )
}
