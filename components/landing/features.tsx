"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, Layers } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Enhancement",
    description: "Transform any photo into professional iPhone 14 Pro Max quality with advanced AI technology."
  },
  {
    icon: Layers,
    title: "Bulk Watermarking",
    description: "Add custom watermarks to hundreds of photos at once. Perfect for photographers and businesses."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get results in seconds. No waiting, no complexity, just instant enhancement and watermarking."
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your photos are processed securely and never stored. Complete privacy guaranteed."
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-gradient-to-b from-purple-50/50 to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Simple. Fast. Professional.
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            Everything you need to transform your photos,
            <span className="block mt-2 font-medium text-purple-600">nothing you don&apos;t.</span>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              className="text-center p-10 bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-100/50 shadow-xl shadow-purple-100/20 hover:shadow-2xl hover:shadow-purple-200/30 transition-all duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg"
              >
                <feature.icon className="h-10 w-10 text-purple-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg font-light">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

