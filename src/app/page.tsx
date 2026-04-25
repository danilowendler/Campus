import { HeroSection } from "@/components/campus/HeroSection";
import { SkillMarquee } from "@/components/campus/SkillMarquee";
import { HowItWorksSection } from "@/components/campus/HowItWorksSection";
import { FeaturedProjectsSection } from "@/components/campus/FeaturedProjectsSection";
import { CtaSection } from "@/components/campus/CtaSection";
import { Footer } from "@/components/campus/Footer";

export default function Home() {
  return (
    <>
      <HeroSection />
      <SkillMarquee />
      <HowItWorksSection />
      <FeaturedProjectsSection />
      <CtaSection />
      <Footer />
    </>
  );
}
