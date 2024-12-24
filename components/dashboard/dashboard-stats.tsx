"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Image, 
  FileText, 
  Users, 
  HardDrive 
} from "lucide-react";

const stats = [
  {
    label: "Total Images",
    value: "1,234",
    icon: Image,
    color: "text-blue-500",
  },
  {
    label: "Certificates",
    value: "56",
    icon: FileText,
    color: "text-green-500",
  },
  {
    label: "Team Members",
    value: "12",
    icon: Users,
    color: "text-purple-500",
  },
  {
    label: "Storage Used",
    value: "45.2 GB",
    icon: HardDrive,
    color: "text-orange-500",
  },
];

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center gap-4">
            <stat.icon className={cn("h-8 w-8", stat.color)} />
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}