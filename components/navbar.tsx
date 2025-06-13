"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-sm border-b border-purple-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-purple-600">
            PixelFly
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-purple-600 transition-colors">
              About
            </Link>

            <Button variant="outline" size="sm" asChild className="border-purple-200 text-purple-600 hover:bg-purple-50">
              <Link href="https://github.com/romaric250/pixelfly" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Star
              </Link>
            </Button>

            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
              Try Now
            </Button>
          </div>

          <div className="md:hidden">
            <button
              className="p-2 text-gray-600"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-purple-100">
          <div className="px-6 py-4 space-y-4">
            <Link href="#features" className="block text-gray-600 hover:text-purple-600">
              Features
            </Link>
            <Link href="#about" className="block text-gray-600 hover:text-purple-600">
              About
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              <Button variant="outline" size="sm" asChild className="border-purple-200 text-purple-600">
                <Link href="https://github.com/romaric250/pixelfly" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Star on GitHub
                </Link>
              </Button>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                Try Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}