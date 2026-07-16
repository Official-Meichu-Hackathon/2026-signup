// Ported from the 2025 site's Footer.vue (same assets, gradient, and links).
import facebookIcon from '../../assets/Footer/facebook.svg'
import instagramIcon from '../../assets/Footer/instagram.svg'
import gmailIcon from '../../assets/Footer/gmail.svg'

export default function Footer() {
  return (
    <footer className="relative z-10 flex w-full flex-col items-center justify-center py-6">
      <div className="mb-2 flex gap-8">
        <a
          href="https://www.facebook.com/HackMeiChu"
          aria-label="Facebook"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={facebookIcon} alt="Facebook" width="50" height="50" />
        </a>
        <a
          href="https://www.instagram.com/mc_hackathon"
          aria-label="Instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={instagramIcon} alt="Instagram" width="50" height="50" />
        </a>
        <a
          href="mailto:2026mchackathon@gmail.com"
          aria-label="Email"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={gmailIcon} alt="Email" width="50" height="50" />
        </a>
      </div>
      <div className="text-center text-lg font-bold text-white">
        Copyright © 2026 Meichu Hackathon
      </div>
    </footer>
  )
}
