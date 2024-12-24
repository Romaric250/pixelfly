"use client";

import { motion } from "framer-motion";
import { Image, Layout } from "lucide-react";

const features = [
  {
    icon: Image,
    title: "Image Management",
    description: "Upload, compress, and organize your images with our intuitive drag-and-drop interface."
  },
  {
    icon: Image,
    title: "Certificate Generation",
    description: "Create professional certificates with customizable templates and bulk processing."
  },
  {
    icon: Layout,
    title: "Dynamic Flyers",
    description: "Design stunning flyers with our advanced editor and collaborative tools."
  }
];

export function Features() {
  return (
    <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={<feature.icon className="h-10 w-10" />}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-6 bg-background rounded-lg shadow-lg"
    >
      <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}