import { Navbar } from "@/components/navbar";
import { LandingHero } from "@/components/landing/hero";
import { BeforeAfterShowcase } from "@/components/landing/before-after-showcase";
import { InteractiveDemo } from "@/components/landing/interactive-demo";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <LandingHero />
      <BeforeAfterShowcase />
      <InteractiveDemo />
      <Features />
      <Footer />
    </div>
  );
}
