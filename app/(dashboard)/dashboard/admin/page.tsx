"use client";

import { useRole } from "@/hooks/use-role";
import { redirect } from "next/navigation";
import { AdminUserList } from "@/components/dashboard/admin/user-list";
import { AdminStats } from "@/components/dashboard/admin/admin-stats";
import { AdminPayments } from "@/components/dashboard/admin/payments";

export default function AdminPage() {
  const role = "admin";
  // const { role } = useRole();

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <AdminStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminUserList />
        <AdminPayments />
      </div>
    </div>
  );
}