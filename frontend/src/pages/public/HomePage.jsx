import { useEffect, useRef } from "react";
import HeroSection from "../../components/home/HomeHeroNew/HomeHero";
import WhatWeDoSection from "../../components/home/WhatWeDoSection/WhatWeDoSection";
import EventsSection from "../../components/home/EventsSection/EventsSection";
import ImpactSection from "../../components/home/ImpactSection/ImpactSection";
import SupportSection from "../../components/home/SupportSection/SupportSection";
import "./HomePage.css";

function HomePage() {
  const orbRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (!orbRef.current) { ticking = false; return; }
        const scrollY = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docH > 0 ? scrollY / docH : 0;

        // Orb travels from top-right → centre-left → bottom-right as you scroll
const x = 10 - progress * 1;
const y = -10 + progress * 1;

        orbRef.current.style.transform = `translate(${x}vw, ${y}vh)`;
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // set initial position
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="home-page">
      {/* Single shared orb — moves with scroll */}
      <div className="home-page__orb-track" aria-hidden="true">
        <div ref={orbRef} className="home-page__orb" />
      </div>

      <HeroSection />
      <WhatWeDoSection />
      <EventsSection />
      <ImpactSection />
      <SupportSection />
    </div>
  );
}

export default HomePage;