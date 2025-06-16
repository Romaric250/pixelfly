"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageComparisonSlider } from '@/components/ui/image-comparison-slider';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const demoImages = [
  {
    id: 'portrait',
    title: 'Portrait Enhancement',
    description: 'Professional headshot quality from any selfie',
    before: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=450&fit=crop&crop=face&blur=2&sat=-40&bri=-25',
    after: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=450&fit=crop&crop=face&auto=enhance&sharp=40&sat=25&bri=15',
    category: 'Portrait'
  },
  {
    id: 'landscape',
    title: 'Landscape Perfection',
    description: 'Transform ordinary scenes into breathtaking vistas',
    before: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=450&fit=crop&blur=1&sat=-50&bri=-30',
    after: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=450&fit=crop&auto=enhance&sharp=35&sat=40&bri=20',
    category: 'Landscape'
  },
  {
    id: 'food',
    title: 'Food Photography',
    description: 'Make every meal look Instagram-worthy',
    before: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=450&fit=crop&blur=1&sat=-60&bri=-35',
    after: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=450&fit=crop&auto=enhance&sharp=30&sat=50&bri=25',
    category: 'Food'
  }
];

export function InteractiveDemo() {
  const [selectedDemo, setSelectedDemo] = useState(demoImages[0]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  return (
    <section className="py-20 bg-white">
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
            <Play className="w-6 h-6 text-purple-600" />
            <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">
              Interactive Demo
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Try It <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">Yourself</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Drag the slider to see the dramatic difference PixelFly makes. 
            Experience the power of AI photo enhancement in real-time.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Demo Categories */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Choose a Category</h3>
            {demoImages.map((demo) => (
              <button
                key={demo.id}
                onClick={() => setSelectedDemo(demo)}
                className={`w-full text-left p-4 rounded-2xl transition-all duration-300 ${
                  selectedDemo.id === demo.id
                    ? 'bg-purple-50 border-2 border-purple-200 shadow-lg'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-purple-50/50 hover:border-purple-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    selectedDemo.id === demo.id ? 'bg-purple-600' : 'bg-gray-400'
                  }`}></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{demo.title}</h4>
                    <p className="text-sm text-gray-600">{demo.description}</p>
                    <div className="mt-2">
                      <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold">
                        {demo.category}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}

            <div className="pt-4 space-y-3">
              <Button
                variant="outline"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="w-full"
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause Auto Demo
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Auto Demo
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setSelectedDemo(demoImages[0])}
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Demo
              </Button>
            </div>
          </motion.div>

          {/* Interactive Slider */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-3xl border border-purple-100/50 shadow-xl">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedDemo.title}
                </h3>
                <p className="text-gray-600">{selectedDemo.description}</p>
              </div>

              <ImageComparisonSlider
                beforeImage={selectedDemo.before}
                afterImage={selectedDemo.after}
                alt={selectedDemo.title}
                className="mb-6 shadow-2xl"
              />

              {/* Enhancement Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Clarity', value: '+85%' },
                  { label: 'Color', value: '+92%' },
                  { label: 'Detail', value: '+78%' },
                  { label: 'Quality', value: '+95%' }
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 bg-white rounded-xl border border-purple-100">
                    <div className="text-2xl font-bold text-purple-600 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Enhance Your Photos
                </Button>
                <Button variant="outline" className="flex-1">
                  Learn More
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-3xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Transform Your Photos?
            </h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Join thousands of users who have already enhanced millions of photos with PixelFly's AI technology.
            </p>
            <Button 
              size="lg"
              className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-8 py-3"
            >
              Start Enhancing Now
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


