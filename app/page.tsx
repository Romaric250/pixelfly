import { Navbar } from "@/components/navbar";
import { LandingHero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <LandingHero />
      <Features />
      <Footer />
    </div>
  );
}
