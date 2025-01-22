import Link from "next/link";
import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">PixelFly</h3>
            <p className="text-muted-foreground text-sm">Transform your images with AI-powered tools.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="#features" className="text-muted-foreground text-sm hover:text-primary">Features</Link></li>
              <li><Link href="#" className="text-muted-foreground text-sm hover:text-primary">Pricing</Link></li>
              <li><Link href="#" className="text-muted-foreground text-sm hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            {/* <h3 className="text-lg font-semibold mb-4">Star on Github</h3> */}
            <Link href="https://github.com/romaric250/pixelfly" target="__blank" className="flex items-center text-muted-foreground hover:text-primary">
              <Github className="h-5 w-5 mr-2" />
              GitHub
            </Link>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PixelFly. All rights reserved.</p>
          <p className="mt-2">Developed by <Link href="https://github.com/romaric250" target="__blank" className="underline"> Romaric Lonfonyuy</Link></p>
        </div>
      </div>
    </footer>
  );
}

