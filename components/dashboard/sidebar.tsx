"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Image, 
  FileText, 
  Users, 
  Settings,
  CreditCard,
  History,
  ShieldCheck
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
// import { useRole } from "@/hooks/use-role";

const commonRoutes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Images",
    icon: Image,
    href: "/dashboard/images",
    color: "text-violet-500",
  },
  {
    label: "Certificates",
    icon: FileText,
    href: "/dashboard/certificates",
    color: "text-pink-700",
  },
  {
    label: "History",
    icon: History,
    href: "/dashboard/history",
    color: "text-yellow-600",
  },
  {
    label: "Team",
    icon: Users,
    href: "/dashboard/team",
    color: "text-orange-700",
  },
  {
    label: "Billing",
    icon: CreditCard,
    href: "/dashboard/billing",
    color: "text-emerald-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

const adminRoutes = [
  {
    label: "Admin Panel",
    icon: ShieldCheck,
    href: "/dashboard/admin",
    color: "text-red-500",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const role = "admin"
  // const { role } = useRole();
  
  const routes = [...commonRoutes, ...(role === 'admin' ? adminRoutes : [])];

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-background border-r">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">PixelFly</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-primary/10 rounded-lg transition",
                pathname === route.href ? "bg-primary/10" : "transparent",
              )}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center flex-1"
              >
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}