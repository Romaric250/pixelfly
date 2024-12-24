"use client";

import { motion } from "framer-motion";
import { ActivityList } from "@/components/dashboard/activity-list";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";
import { useState } from "react";
import { addDays } from "date-fns";

export default function HistoryPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Activity History</h1>
        {/* <DateRangePicker 
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        /> */}
      </div>
      <ActivityList dateRange={dateRange} />
    </div>
  );
}