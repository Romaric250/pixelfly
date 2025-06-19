"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Sparkles, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/auth/auth-button";
import { GitHubStarButton } from "@/components/ui/github-star-button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed w-full z-50 bg-white/80 backdrop-blur-xl"
    >
      {/* Unique floating navbar container */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="bg-white/60 backdrop-blur-md rounded-full border border-purple-100/50 shadow-lg shadow-purple-100/20 px-8 py-4">
          <div className="flex justify-between items-center">

            {/* Creative logo with animated elements */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center"
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-purple-400 rounded-xl blur-md -z-10"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  PixelFly
                </span>
                <span className="text-xs text-purple-400 font-mono -mt-1">
                  AI Enhancement
                </span>
              </div>
            </Link>

            {/* Center navigation with unique styling */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink href="/enhance">Enhance</NavLink>
              <NavLink href="/watermark">Watermark</NavLink>
              <NavLink href="/pricing">Pricing</NavLink>
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#about">About</NavLink>
              <div className="w-px h-6 bg-purple-200 mx-4" />

              {/* Live GitHub star button */}
              <GitHubStarButton
                username="romaric250"
                repo="pixelfly"
                className="rounded-full"
              />
            </div>

            {/* Auth Button */}
            <div className="hidden md:block">
              <AuthButton />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isOpen ? (
                    <div className="w-6 h-6 relative">
                      <span className="absolute top-3 left-0 w-6 h-0.5 bg-purple-600 rotate-45 transform origin-center" />
                      <span className="absolute top-3 left-0 w-6 h-0.5 bg-purple-600 -rotate-45 transform origin-center" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 relative">
                      <span className="absolute top-1 left-0 w-6 h-0.5 bg-purple-600" />
                      <span className="absolute top-3 left-0 w-6 h-0.5 bg-purple-600" />
                      <span className="absolute top-5 left-0 w-6 h-0.5 bg-purple-600" />
                    </div>
                  )}
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu with unique animation */}
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="md:hidden overflow-hidden"
      >
        <div className="mx-6 mb-4 bg-white/80 backdrop-blur-md rounded-2xl border border-purple-100/50 shadow-lg p-6">
          <div className="space-y-4">
            <Link href="/enhance" className="block text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Enhance Photos
            </Link>
            <Link href="/watermark" className="block text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Bulk Watermark
            </Link>
            <Link href="/pricing" className="block text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Pricing
            </Link>
            <Link href="#features" className="block text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Features
            </Link>
            <Link href="#about" className="block text-gray-700 hover:text-purple-600 font-medium transition-colors">
              About
            </Link>

            <div className="pt-4 border-t border-purple-100 space-y-3">
              <GitHubStarButton
                username="romaric250"
                repo="pixelfly"
                className="w-full"
              />

              <div className="w-full">
                <AuthButton />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}

// Custom NavLink component with unique hover effects
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative px-4 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors group"
    >
      {children}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </Link>
  );
}