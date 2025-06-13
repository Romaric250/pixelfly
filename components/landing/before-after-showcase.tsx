"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeAfterImage {
  id: string;
  title: string;
  description: string;
  before: string;
  after: string;
  category: string;
}

const sampleImages: BeforeAfterImage[] = [
  {
    id: '1',
    title: 'Portrait Enhancement',
    description: 'Transform blurry selfies into professional portraits',
    before: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&blur=3&sat=-50&bri=-30',
    after: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=enhance&sharp=50&sat=20&bri=10',
    category: 'Portrait'
  },
  {
    id: '2',
    title: 'Landscape Clarity',
    description: 'Enhance outdoor photos with stunning detail',
    before: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&blur=2&sat=-40&bri=-20',
    after: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&auto=enhance&sharp=40&sat=30&bri=15',
    category: 'Landscape'
  },
  {
    id: '3',
    title: 'Night Photography',
    description: 'Brighten dark photos while preserving natural colors',
    before: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400&h=400&fit=crop&blur=2&sat=-60&bri=-40',
    after: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400&h=400&fit=crop&auto=enhance&sharp=30&sat=20&bri=25',
    category: 'Night'
  }
];

export function BeforeAfterShowcase() {
  const [selectedImage, setSelectedImage] = useState(sampleImages[0]);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50/50 via-white to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">
              AI Enhancement
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            See the <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">Magic</span> in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform your everyday photos into professional-quality images with our advanced AI technology. 
            See real examples of how PixelFly enhances photos instantly.
          </p>
        </motion.div>

        {/* Main Before/After Display */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="bg-white rounded-3xl shadow-2xl shadow-purple-100/50 p-8 border border-purple-100/50">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Before/After Images */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Before Image */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Before</span>
                    </div>
                    <div className="relative group">
                      <img
                        src={selectedImage.before}
                        alt={`${selectedImage.title} - Before`}
                        className="w-full h-64 object-cover rounded-2xl border-2 border-gray-200"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                    </div>
                  </div>

                  {/* After Image */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">After</span>
                    </div>
                    <div className="relative group">
                      <img
                        src={selectedImage.after}
                        alt={`${selectedImage.title} - After`}
                        className="w-full h-64 object-cover rounded-2xl border-2 border-purple-200 shadow-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent rounded-2xl"></div>
                      <div className="absolute top-3 right-3">
                        <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          Enhanced
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhancement Arrow */}
                <div className="flex justify-center">
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="bg-purple-600 text-white p-3 rounded-full shadow-lg"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-6">
                <div>
                  <div className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    {selectedImage.category}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {selectedImage.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    {selectedImage.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">AI Enhancements Applied:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {['Noise Reduction', 'Color Enhancement', 'Sharpness Boost', 'Dynamic Range'].map((enhancement) => (
                      <div key={enhancement} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        <span className="text-sm text-gray-600">{enhancement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 rounded-xl font-semibold"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <Sparkles className={`w-4 h-4 mr-2 transition-transform ${isHovering ? 'rotate-12' : ''}`} />
                  Try PixelFly Now
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Image Selection Thumbnails */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="flex gap-4 bg-white rounded-2xl p-4 shadow-lg border border-purple-100/50">
            {sampleImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className={`relative group transition-all duration-300 ${
                  selectedImage.id === image.id 
                    ? 'ring-2 ring-purple-600 ring-offset-2' 
                    : 'hover:ring-2 hover:ring-purple-300 hover:ring-offset-2'
                }`}
              >
                <img
                  src={image.after}
                  alt={image.title}
                  className="w-20 h-20 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-1 left-1 right-1">
                  <div className="bg-white/90 backdrop-blur-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-semibold text-gray-800">{image.category}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
