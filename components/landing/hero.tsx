"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Star } from 'lucide-react';
import Link from "next/link";

export function LandingHero() {

  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-12">
          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 leading-[0.9] tracking-tight">
              Transform Any Photo Into
              <span className="block bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
                iPhone Quality
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              Upload any photo and watch our AI enhance it to professional quality.
              <span className="block mt-2 font-medium text-purple-600">Simple, fast, and completely free.</span>
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-10 py-5 text-lg font-semibold rounded-full shadow-xl shadow-purple-200"
              >
                <Upload className="mr-3 h-6 w-6" />
                Try It Now
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 px-10 py-5 text-lg font-semibold rounded-full"
              >
                <Link href="https://github.com/romaric250/pixelfly" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                  <Star className="h-6 w-6" />
                  Star on GitHub
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Simple demo area */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20"
          >
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-[2rem] p-16 max-w-5xl mx-auto border border-purple-100/50 shadow-2xl shadow-purple-100/20">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-center">
                  <div className="w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-inner">
                    <span className="text-gray-500 font-medium">Before</span>
                  </div>
                  <p className="text-gray-600 font-medium">Low quality photo</p>
                </div>

                <div className="text-center relative">
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(147, 51, 234, 0)",
                        "0 0 0 20px rgba(147, 51, 234, 0.1)",
                        "0 0 0 0 rgba(147, 51, 234, 0)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-40 h-40 bg-gradient-to-br from-purple-200 to-purple-300 rounded-3xl mx-auto mb-6 flex items-center justify-center relative"
                  >
                    <span className="text-purple-700 font-medium">After</span>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm px-3 py-1.5 rounded-full font-semibold shadow-lg"
                    >
                      AI Enhanced
                    </motion.div>
                  </motion.div>
                  <p className="text-gray-600 font-medium">Professional quality</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-3 gap-12 max-w-3xl mx-auto pt-12"
          >
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">2s</div>
              <div className="text-gray-600 font-medium mt-2">Processing</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">Free</div>
              <div className="text-gray-600 font-medium mt-2">Open Source</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">10x</div>
              <div className="text-gray-600 font-medium mt-2">Better Quality</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
