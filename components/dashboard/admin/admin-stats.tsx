"use client";

import { motion } from "framer-motion";
import { 
  Users,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const stats = [
  {
    label: "Total Users",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: Users,
  },
  {
    label: "Monthly Revenue",
    value: "$12,345",
    change: "+8%",
    trend: "up",
    icon: CreditCard,
  },
];

export function AdminStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card p-6 rounded-lg shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className={cn(
              "flex items-center",
              stat.trend === "up" ? "text-green-500" : "text-red-500"
            )}>
              {stat.trend === "up" ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">{stat.change}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}