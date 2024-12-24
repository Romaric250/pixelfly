import { Navbar } from "@/components/navbar";
import { LandingHero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <LandingHero />
      <Features />
    </div>
  );
}