"use client";

import { motion } from "framer-motion";
import { 
  Image,
  FileText,
  Upload,
  Download,
  Edit,
  Trash2
} from "lucide-react";

type Activity = {
  id: string;
  type: "upload" | "download" | "edit" | "delete";
  item: string;
  timestamp: string;
  user: string;
};

const activities: Activity[] = [
  {
    id: "1",
    type: "upload",
    item: "presentation.jpg",
    timestamp: "2 minutes ago",
    user: "John Doe",
  },
  {
    id: "2",
    type: "edit",
    item: "certificate-template.png",
    timestamp: "1 hour ago",
    user: "Jane Smith",
  },
  {
    id: "3",
    type: "download",
    item: "team-photo.jpg",
    timestamp: "3 hours ago",
    user: "Mike Johnson",
  },
];

const activityIcons = {
  upload: Upload,
  download: Download,
  edit: Edit,
  delete: Trash2,
};

const activityColors = {
  upload: "text-green-500",
  download: "text-blue-500",
  edit: "text-orange-500",
  delete: "text-red-500",
};

export function ActivityList({ dateRange }: { dateRange: { from: Date; to: Date } }) {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = activityIcons[activity.type];
        
        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card p-4 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-2 rounded-full",
                "bg-background",
                activityColors[activity.type]
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  {activity.user} {activity.type}ed {activity.item}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}