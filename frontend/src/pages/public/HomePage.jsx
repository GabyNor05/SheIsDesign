import HeroSection from "../../components/home/HomeHeroNew/HomeHero";
import WhatWeDoSection from "../../components/home/WhatWeDoSection/WhatWeDoSection";
import EventsSection from "../../components/home/EventsSection/EventsSection";
import LeaderboardSection from "../../components/home/LeaderboardSection/LeaderboardSection";
import FeaturedWorkSection from "../../components/home/FeaturedWorkSection/FeaturedWorkSection";
import ImpactSection from "../../components/home/ImpactSection/ImpactSection";
import SupportSection from "../../components/home/SupportSection/SupportSection"
import CTASection from "../../components/home/CTASection/CTASection";

function HomePage() {
  return (
    <>
      <HeroSection />
      <WhatWeDoSection />
      <EventsSection />
      <LeaderboardSection />
      <FeaturedWorkSection />
      <ImpactSection />
      <SupportSection />
      <CTASection />
    </>
  );
}

export default HomePage;