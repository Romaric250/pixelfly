"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Enhancement",
    description: "Transform any photo into professional quality with advanced AI technology."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get results in seconds. No waiting, no complexity, just instant enhancement."
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your photos are processed securely and never stored. Complete privacy guaranteed."
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-purple-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple. Fast. Professional.
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to transform your photos, nothing you don't.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center p-8 bg-white rounded-2xl"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <feature.icon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

