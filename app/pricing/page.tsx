"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Zap, 
  Crown, 
  Check, 
  Clock, 
  Star,
  Rocket,
  Shield,
  Heart
} from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function PricingPage() {
  const comingSoonFeatures = [
    {
      icon: Sparkles,
      title: "Free Tier",
      description: "Perfect for trying out PixelFly",
      features: [
        "5 photo enhancements per month",
        "3 watermarks per month", 
        "Basic AI enhancement",
        "Standard watermark styles"
      ],
      price: "Free",
      badge: "Always Free",
      badgeColor: "bg-green-100 text-green-700"
    },
    {
      icon: Zap,
      title: "Pro Plan",
      description: "For creators and professionals",
      features: [
        "Unlimited photo enhancements",
        "Unlimited watermarking",
        "Advanced AI enhancement",
        "All watermark styles",
        "Batch processing",
        "Priority support"
      ],
      price: "$9.99",
      period: "/month",
      badge: "Most Popular",
      badgeColor: "bg-purple-100 text-purple-700"
    },
    {
      icon: Crown,
      title: "Enterprise",
      description: "For teams and businesses",
      features: [
        "Everything in Pro",
        "API access",
        "Custom watermark styles",
        "White-label solution",
        "Dedicated support",
        "Custom integrations"
      ],
      price: "Custom",
      badge: "Enterprise",
      badgeColor: "bg-blue-100 text-blue-700"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Clock className="w-4 h-4" />
              Coming Soon
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Simple, Transparent
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 block">
                Pricing
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              We're crafting the perfect pricing plans for PixelFly. Get ready for affordable, 
              powerful AI photo enhancement and watermarking solutions.
            </p>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>No hidden fees</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Fair pricing</span>
              </div>
            </div>
          </motion.div>

          {/* Coming Soon Pricing Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {comingSoonFeatures.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="relative"
              >
                <Card className={`h-full transition-all duration-300 hover:shadow-xl ${
                  index === 1 ? 'border-purple-200 shadow-lg scale-105' : 'hover:scale-105'
                }`}>
                  <CardHeader className="text-center pb-4">
                    {plan.badge && (
                      <Badge className={`${plan.badgeColor} mb-4 mx-auto w-fit`}>
                        {plan.badge}
                      </Badge>
                    )}
                    
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      index === 1 ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      <plan.icon className={`w-8 h-8 ${
                        index === 1 ? 'text-purple-600' : 'text-gray-600'
                      }`} />
                    </div>
                    
                    <CardTitle className="text-2xl font-bold mb-2">{plan.title}</CardTitle>
                    <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                    
                    <div className="text-center">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      {plan.period && (
                        <span className="text-gray-500 text-lg">{plan.period}</span>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full ${
                        index === 1 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      disabled
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Coming Soon Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-16"
          >
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Rocket className="w-8 h-8 text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-900">What's Coming</h3>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: Sparkles, title: "Free Tier", desc: "Always free plan for everyone" },
                    { icon: Zap, title: "Pro Features", desc: "Advanced AI and unlimited processing" },
                    { icon: Shield, title: "Enterprise", desc: "Custom solutions for businesses" },
                    { icon: Heart, title: "Fair Pricing", desc: "Transparent, no hidden costs" }
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <item.icon className="w-6 h-6 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notify Me Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <Card className="max-w-2xl mx-auto bg-white border-2 border-purple-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Be the First to Know
                </h3>
                <p className="text-gray-600 mb-6">
                  Get notified when our pricing plans launch. Plus, early subscribers get special launch discounts!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <Button className="bg-purple-600 hover:bg-purple-700 px-6 py-3">
                    Notify Me
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 mt-4">
                  No spam, just updates on pricing and new features.
                </p>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </>
  );
}
