import { Navbar } from "@/components/navbar";
import { LandingHero } from "@/components/landing/hero";
import { LandingStats } from "@/components/landing/stats";
import { BeforeAfterShowcase } from "@/components/landing/before-after-showcase";
import { InteractiveDemo } from "@/components/landing/interactive-demo";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <LandingHero />
      <LandingStats />
      <BeforeAfterShowcase />
      <InteractiveDemo />
      <Features />
      <Footer />
    </div>
  );
}
