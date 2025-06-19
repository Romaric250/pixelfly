import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - PixelFly | AI Photo Enhancement & Watermarking Plans",
  description: "Simple, transparent pricing for PixelFly's AI photo enhancement and watermarking services. Free tier available, pro plans coming soon.",
  keywords: [
    "pricing",
    "plans", 
    "subscription",
    "AI photo enhancement pricing",
    "watermarking plans",
    "photo editing costs",
    "PixelFly pricing",
    "free photo enhancement",
    "pro photo tools"
  ],
  openGraph: {
    title: "Pricing - PixelFly | AI Photo Enhancement Plans",
    description: "Simple, transparent pricing for PixelFly's AI photo enhancement and watermarking services. Free tier available, pro plans coming soon.",
    type: "website",
    url: "https://pixelfly.ai/pricing",
    images: [
      {
        url: "/og-pricing.jpg",
        width: 1200,
        height: 630,
        alt: "PixelFly Pricing Plans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing - PixelFly | AI Photo Enhancement Plans",
    description: "Simple, transparent pricing for PixelFly's AI photo enhancement and watermarking services. Free tier available, pro plans coming soon.",
    images: ["/og-pricing.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://pixelfly.ai/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
