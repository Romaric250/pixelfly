"use client";

import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const payments = [
  {
    id: "1",
    user: "John Doe",
    amount: "$29.99",
    status: "completed",
    date: "2024-03-01",
  },
  {
    id: "2",
    user: "Jane Smith",
    amount: "$49.99",
    status: "pending",
    date: "2024-03-02",
  },
];

export function AdminPayments() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card p-6 rounded-lg"
    >
      <h2 className="text-lg font-semibold mb-4">Recent Payments</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.user}</TableCell>
              <TableCell>{payment.amount}</TableCell>
              <TableCell>
                <Badge 
                  variant={payment.status === "completed" ? "default" : "secondary"}
                >
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell>{payment.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}