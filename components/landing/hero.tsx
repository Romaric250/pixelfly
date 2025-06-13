"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Star, Sparkles, Zap, Camera, Play } from 'lucide-react';
import { ImageComparisonSlider } from "@/components/ui/image-comparison-slider";
import Link from "next/link";

export function LandingHero() {
  const heroImages = [
    {
      id: 1,
      before: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face&blur=3&sat=-60&bri=-40',
      after: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face&auto=enhance&sharp=50&sat=30&bri=20',
      title: 'Portrait Enhancement'
    },
    {
      id: 2,
      before: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&blur=2&sat=-50&bri=-30',
      after: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=enhance&sharp=40&sat=40&bri=25',
      title: 'Landscape Magic'
    },
    {
      id: 3,
      before: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&blur=1&sat=-70&bri=-40',
      after: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&auto=enhance&sharp=35&sat=60&bri=30',
      title: 'Food Photography'
    }
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, heroImages.length]);

  const currentImage = heroImages[currentImageIndex];

  return (
    <section className="relative pt-20 pb-32 px-6 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white to-purple-50/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05),transparent_50%)]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 lg:pr-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Enhancement
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 leading-[0.9] tracking-tight"
            >
              Transform Any Photo Into
              <span className="block bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent mt-2">
                iPhone 14 Pro Max Quality
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 leading-relaxed max-w-lg"
            >
              Upload any photo and watch our advanced AI enhance it to professional quality in seconds.
              <span className="block mt-3 font-semibold text-purple-600">
                ✨ Simple • Fast • Completely Free
              </span>
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-3 gap-6 py-6"
            >
              {[
                { value: '2s', label: 'Processing' },
                { value: 'Free', label: 'Open Source' },
                { value: '10x', label: 'Better Quality' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  asChild
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl shadow-purple-200/50 group"
                >
                  <Link href="/sign-up" className="flex items-center gap-3">
                    <Upload className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Try PixelFly Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 px-8 py-4 text-lg font-semibold rounded-2xl group"
                >
                  <Link href="https://github.com/romaric250/pixelfly" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                    <Star className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Star on GitHub
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Side - Interactive Before/After Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Main Before/After Display */}
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl shadow-purple-100/50 border border-purple-100/50">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Camera className="w-4 h-4" />
                  {currentImage.title}
                </div>
              </div>

              {/* Interactive Slider */}
              <div className="relative mb-6">
                <ImageComparisonSlider
                  beforeImage={currentImage.before}
                  afterImage={currentImage.after}
                  alt={currentImage.title}
                  className="rounded-2xl shadow-lg"
                />
                
                {/* Enhancement Badge */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 1, -1, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  AI Enhanced
                </motion.div>
              </div>

              {/* Image Selector */}
              <div className="flex justify-center gap-3 mb-6">
                {heroImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setIsAutoPlaying(false);
                    }}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-purple-600 ring-2 ring-purple-200' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <img
                      src={image.after}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Enhancement Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Clarity', value: '+95%', color: 'text-green-600' },
                  { label: 'Color', value: '+87%', color: 'text-blue-600' },
                  { label: 'Detail', value: '+92%', color: 'text-purple-600' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    className="text-center p-3 bg-gray-50 rounded-xl"
                  >
                    <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Auto-play Toggle */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  {isAutoPlaying ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Auto Demo
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Start Auto Demo
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-6 -left-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-2xl shadow-lg"
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>

            <motion.div
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-6 -right-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3 rounded-2xl shadow-lg"
            >
              <Camera className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-3xl p-8 max-w-4xl mx-auto text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Transform Your Photos?
            </h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Join thousands of users who have already enhanced millions of photos with PixelFly's AI technology.
            </p>
            <Button 
              size="lg"
              asChild
              className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-8 py-3 rounded-2xl"
            >
              <Link href="/sign-up">
                Start Enhancing Now
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
