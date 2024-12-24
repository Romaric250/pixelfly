"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Marketing Manager",
    content: "PixelFly has revolutionized our image management process. It's incredibly intuitive and powerful!",
    avatar: "/avatars/alex.jpg",
  },
  {
    name: "Sarah Lee",
    role: "Event Coordinator",
    content: "The certificate generation feature is a game-changer. It's saved us countless hours of work.",
    avatar: "/avatars/sarah.jpg",
  },
  {
    name: "Mike Chen",
    role: "Graphic Designer",
    content: "As a designer, I love the flyer creation tools. They're flexible and produce stunning results.",
    avatar: "/avatars/mike.jpg",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

