import HeroSection from "../../components/home/HeroSection";
import WhatWeDoSection from "../../components/home/WhatWeDoSection";
import EventsSection from "../../components/home/EventsSection";
import LeaderboardSection from "../../components/home/LeaderboardSection";
import FeaturedWorkSection from "../../components/home/FeaturedWorkSection";
import ImpactSection from "../../components/home/ImpactSection";
import SupportSection from "../../components/home/SupportSection";
import CTASection from "../../components/home/CTASection";

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