import heroBg from '../assets/home/hero-bg-plain.jpg'
import heroTitle from '../assets/home/hero-title-overlay.png'
import heroCta from '../assets/home/hero-cta-overlay.png'
import bgGroupRules from '../assets/home/bg-groupintro-rules.png'
import bgAwards from '../assets/home/awards-gradient.png'
import EventVision from '../components/home/EventVision'
import GroupIntro from '../components/home/GroupIntro'
import Rules from '../components/home/Rules'
import Awards from '../components/home/Awards'
import PartnerLogos from '../components/home/PartnerLogos'
import StaffAndThanks from '../components/home/StaffAndThanks'
import FloatingNav from '../components/home/FloatingNav'

export default function Home() {
  return (
    <div className="font-sans">
      <FloatingNav />

      <section
        id="intro"
        className="relative aspect-[1440/1024] w-full overflow-hidden bg-black"
      >
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <img
          src={heroTitle}
          alt="梅竹黑客松 14th"
          className="animate-pop-in-right absolute top-[11.9%] left-[15.14%] w-[82.75%]"
          style={{ animationDelay: '0.1s' }}
        />
        <img
          src={heroCta}
          alt="準備好創造未來了嗎？"
          className="animate-pop-in-right absolute top-[50.98%] left-[56.11%] w-[42.13%]"
          style={{ animationDelay: '0.4s' }}
        />
      </section>

      <EventVision />

      <section className="relative bg-black">
        <img
          src={bgGroupRules}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative">
          <GroupIntro />
          <Rules />
        </div>
      </section>

      <section id="awards" className="relative bg-black">
        <img
          src={bgAwards}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <img
          src={bgGroupRules}
          alt=""
          className="pointer-events-none absolute inset-x-0 top-0 h-[50vh] w-full [mask-image:linear-gradient(to_bottom,black,transparent)] object-cover object-bottom"
        />
        <div className="relative">
          <Awards />
        </div>
      </section>

      <section className="relative bg-white" data-nav-theme="light">
        <img
          src={bgAwards}
          alt=""
          className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] w-full [mask-image:linear-gradient(to_bottom,black,transparent)] object-cover object-bottom"
        />
        <div className="relative">
          <PartnerLogos />
          <StaffAndThanks />
        </div>
      </section>
    </div>
  )
}
