import Link from "next/link";
import { Github, Star } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-purple-100">
      <div className="max-w-6xl mx-auto py-16 px-6">
        <div className="text-center space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-purple-600 mb-4">
              PixelFly
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Transform any photo into professional quality with AI.
              Open source and privacy-first.
            </p>
          </div>

          <div className="flex justify-center gap-6">
            <Link
              href="https://github.com/romaric250/pixelfly"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Star className="h-5 w-5" />
              Star on GitHub
            </Link>
            <Link
              href="https://github.com/romaric250/pixelfly"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Github className="h-5 w-5" />
              View Source
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-purple-100 text-center">
          <p className="text-gray-500 text-sm mb-2">
            &copy; {new Date().getFullYear()} PixelFly. Open source under MIT License.
          </p>
          <p className="text-gray-500 text-sm">
            Made by{" "}
            <Link
              href="https://github.com/romaric250"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 transition-colors"
            >
              Romaric Lonfonyuy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

