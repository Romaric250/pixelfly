"use client";

import Link from "next/link";
import { Github, Star, Sparkles } from 'lucide-react';
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-gradient-to-t from-purple-50/30 to-white border-t border-purple-100/50">
      <div className="max-w-6xl mx-auto py-20 px-6">
        <div className="text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                PixelFly
              </h3>
            </div>
            <p className="text-lg text-gray-600 max-w-lg mx-auto font-light leading-relaxed">
              Transform any photo into professional quality with AI.
              <span className="block mt-2 font-medium text-purple-600">Open source and privacy-first.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center gap-8"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="https://github.com/romaric250/pixelfly"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border border-purple-100 rounded-full text-gray-700 hover:text-purple-600 hover:border-purple-200 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Star className="h-5 w-5" />
                <span className="font-medium">Star on GitHub</span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="https://github.com/romaric250/pixelfly"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border border-purple-100 rounded-full text-gray-700 hover:text-purple-600 hover:border-purple-200 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Github className="h-5 w-5" />
                <span className="font-medium">View Source</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 pt-8 border-t border-purple-100/50 text-center space-y-3"
        >
          <p className="text-gray-500 font-light">
            &copy; {new Date().getFullYear()} PixelFly. Open source under MIT License.
          </p>
          <p className="text-gray-500 font-light">
            Crafted with care by{" "}
            <Link
              href="https://github.com/romaric250"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              Romaric Lonfonyuy
            </Link>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

