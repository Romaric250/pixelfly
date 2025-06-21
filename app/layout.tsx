import './globals.css';
import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { DottedBackground } from '@/components/ui/dotted-background';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PixelFly - Make Your Photos Pop Out',
  description: 'AI-powered photo enhancement that makes your photos pop out with stunning clarity and vibrant colors. Open source and privacy-first.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <body className={`${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <DottedBackground className="min-h-screen">
              {children}
            </DottedBackground>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}