"use client";

import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

const ButterflyPath = () => (
  <motion.path
    d="M0 40 Q 40 0, 80 40 Q 120 80, 160 40 M80 40 L80 160"
    stroke="currentColor"
    strokeWidth="6"
    fill="none"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 2, ease: "easeInOut" }}
  />
);

export function LandingHero() {
  const isSignedIn = true;
  // const { isSignedIn } = useAuth();
  const controls = useAnimation();

  useEffect(() => {
    const animationSequence = async () => {
      await controls.start("visible");
      await new Promise(resolve => setTimeout(resolve, 2000));
      await controls.start("flyAway");
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for the butterfly to fly away
      await controls.start("revealText");
    };

    animationSequence();
  }, [controls]);

  return (
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-xl sm:text-4xl font-bold tracking-tight">
            Transform Your Images with
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50 relative">
              {" "}
              Pixel
              <motion.span
                animate={controls}
                variants={{
                  visible: { opacity: 0, display: "none" },
                  flyAway: { opacity: 0, display: "none" },
                  revealText: { opacity: 1, display: "inline-block" }
                }}
                className="inline-block"
              >
                Fly
              </motion.span>
              {/* <motion.svg
                viewBox="0 0 160 160"
                className="w-10 h-10 sm:w-40 sm:h-40 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={controls}
                variants={{
                  visible: { 
                    opacity: 1, 
                    scale: 1, 
                    rotate: [0, 10, -10, 0],
                    transition: {
                      rotate: {
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut",
                      }
                    }
                  },
                  flyAway: { 
                    opacity: 0, 
                    scale: 0.5,
                    x: 100,
                    y: -100,
                    transition: { duration: 1 }
                  }
                }}
              >
                <ButterflyPath />
              </motion.svg> */}
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional image management, certificate generation, and flyer creation platform
            powered by advanced AI technology.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
