import facebookIcon from '../../assets/Footer/mobile-facebook.png'
import gmailIcon from '../../assets/Footer/mobile-gmail.png'
import instagramIcon from '../../assets/Footer/mobile-instagram.png'

export default function MobileFooter() {
  return (
    <footer className="relative h-[60px] w-[390px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[rgba(177,162,202,0.56)] backdrop-blur-[35px]"
      />
      <div className="absolute top-[15px] left-[150px] flex gap-[21.12px]">
        <a
          href="https://www.facebook.com/HackMeiChu"
          aria-label="Facebook"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={facebookIcon}
            alt=""
            className="h-[19.113px] w-[19.113px]"
          />
        </a>
        <a
          href="https://www.instagram.com/mc_hackathon"
          aria-label="Instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={instagramIcon}
            alt=""
            className="h-[19.113px] w-[19.113px]"
          />
        </a>
        <a href="mailto:2026mchackathon@gmail.com" aria-label="Email">
          <img src={gmailIcon} alt="" className="h-[19.113px] w-[19.113px]" />
        </a>
      </div>
      <p className="font-noto absolute top-[25px] left-1/2 h-[26px] w-[144px] -translate-x-1/2 text-center text-[8px] leading-[40px] font-bold text-[#f6f6f6]">
        Copyright © 2026 Meichu Hackathon
      </p>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 shadow-[inset_0_1px_8px_rgba(255,255,255,0.5)]"
      />
    </footer>
  )
}
