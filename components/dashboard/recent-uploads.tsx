"use client";

import { motion } from "framer-motion";

const recentFiles = [
  {
    name: "banner-design.jpg",
    size: "2.4 MB",
    type: "image/jpeg",
    uploadedAt: "2 minutes ago",
  },
  {
    name: "certificate-template.png",
    size: "1.8 MB",
    type: "image/png",
    uploadedAt: "1 hour ago",
  },
  {
    name: "team-photo.jpg",
    size: "3.2 MB",
    type: "image/jpeg",
    uploadedAt: "3 hours ago",
  },
];

export function RecentUploads() {
  return (
    <div className="bg-card rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Uploads</h2>
      <div className="space-y-4">
        {recentFiles.map((file, index) => (
          <motion.div
            key={file.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
          >
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {file.size} • {file.uploadedAt}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}