"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from 'lucide-react';

const pricingPlans = [
  {
    name: "Basic",
    price: "$9.99",
    description: "Perfect for individuals and small teams",
    features: [
      "100 image uploads per month",
      "Basic image editing tools",
      "5 certificate templates",
      "1 custom flyer design",
    ],
  },
  {
    name: "Pro",
    price: "$24.99",
    description: "Ideal for growing businesses",
    features: [
      "Unlimited image uploads",
      "Advanced image editing tools",
      "20 certificate templates",
      "5 custom flyer designs",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with specific needs",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated account manager",
      "24/7 phone support",
      "On-premise deployment option",
    ],
  },
];

export function Pricing() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {pricingPlans.map((plan, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-3xl font-bold mb-4">{plan.price}</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get Started</Button>
              </CardFooter>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
