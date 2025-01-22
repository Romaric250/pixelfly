"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CallToAction() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Images?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied users and start creating stunning visuals today.</p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/sign-up">Get Started Now</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

