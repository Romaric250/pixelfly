import { Navbar } from "@/components/navbar";
import { LandingHero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { ContactForm } from "@/components/landing/contact-form";
import { CallToAction } from "@/components/landing/call-to-action";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <LandingHero />
      <Features />
      <Testimonials />
      <Pricing />
      <ContactForm />
      <CallToAction />
      <Footer />
    </div>
  );
}
