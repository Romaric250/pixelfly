"use client";

import { useUser } from "@clerk/nextjs";
import { DragDropZone } from "@/components/dashboard/drag-drop-zone";
import { RecentUploads } from "@/components/dashboard/recent-uploads";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Welcome back, {user?.firstName}!</h1>
      <DashboardStats />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DragDropZone />
        <RecentUploads />
      </div>
    </div>
  );
}