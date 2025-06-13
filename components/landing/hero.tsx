"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Star } from 'lucide-react';
import Link from "next/link";

export function LandingHero() {

  return (
    <section className="pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-8">
          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
              Transform Any Photo Into
              <span className="block text-purple-600">
                iPhone Quality
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Upload any photo and watch our AI enhance it to professional quality.
              Simple, fast, and completely free.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg">
              <Upload className="mr-2 h-5 w-5" />
              Try It Now
            </Button>

            <Button variant="outline" size="lg" asChild className="border-purple-200 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg">
              <Link href="https://github.com/romaric250/pixelfly" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Star on GitHub
              </Link>
            </Button>
          </motion.div>

          {/* Simple demo area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16"
          >
            <div className="bg-purple-50 rounded-3xl p-12 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Before</span>
                  </div>
                  <p className="text-gray-600">Low quality photo</p>
                </div>

                <div className="text-center">
                  <div className="w-32 h-32 bg-purple-200 rounded-2xl mx-auto mb-4 flex items-center justify-center relative">
                    <span className="text-purple-700 text-sm">After</span>
                    <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                      AI Enhanced
                    </div>
                  </div>
                  <p className="text-gray-600">Professional quality</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">2s</div>
              <div className="text-gray-600">Processing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">Free</div>
              <div className="text-gray-600">Open Source</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">10x</div>
              <div className="text-gray-600">Better Quality</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
