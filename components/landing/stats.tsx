"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Image, Shield } from "lucide-react";

interface Stats {
  users: number;
  photosEnhanced: number;
  photosWatermarked: number;
}

export function LandingStats() {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    photosEnhanced: 0,
    photosWatermarked: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const statsData = [
    {
      icon: Users,
      value: stats.users,
      label: "Happy Users",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      isImplemented: true,
    },
    {
      icon: Image,
      value: stats.photosEnhanced,
      label: "Photos Enhanced",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      isImplemented: true, // Now implemented with real tracking!
    },
    {
      icon: Shield,
      value: stats.photosWatermarked,
      label: "Photos Watermarked",
      color: "text-green-600",
      bgColor: "bg-green-100",
      isImplemented: true, // Now implemented with real tracking!
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50/50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our growing community of photographers and content creators who trust PixelFly
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg shadow-purple-100/50 border border-purple-100/50 hover:shadow-xl transition-all duration-300">
                <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                
                <div className="space-y-2">
                  <motion.div
                    initial={{ scale: 0.5 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent"
                  >
                    {isLoading ? (
                      <div className="w-20 h-12 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
                    ) : stat.isImplemented ? (
                      <CountUpAnimation target={stat.value} />
                    ) : (
                      <span className="text-2xl text-gray-400 font-medium">Coming Soon</span>
                    )}
                  </motion.div>
                  
                  <p className="text-lg font-semibold text-gray-700">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">24/7 Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Enterprise Security</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Count up animation component
function CountUpAnimation({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return <span>{formatNumber(count)}</span>;
}
