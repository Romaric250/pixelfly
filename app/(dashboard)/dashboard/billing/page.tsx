// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import {CreditCard, Check, Zap, Activity, History} from "lucide-react";

// export default function Page() {
//   const [selectedPlan, setSelectedPlan] = useState("pro");

//   const plans = [
//     {
//       name: "Starter",
//       price: "$0",
//       description: "Perfect for side projects and small teams",
//       features: ["5 Projects", "Basic Analytics", "24/7 Support", "1GB Storage"],
//       current: false,
//     },
//     {
//       name: "Pro",
//       price: "$29",
//       description: "Ideal for growing businesses and teams",
//       features: ["Unlimited Projects", "Advanced Analytics", "Priority Support", "10GB Storage", "Custom Domain"],
//       current: true,
//     },
//     {
//       name: "Enterprise",
//       price: "$99",
//       description: "For large organizations with advanced needs",
//       features: ["Everything in Pro", "Dedicated Support", "Unlimited Storage", "SLA", "Custom Integration"],
//       current: false,
//     },
//   ];

//   return (
//     <div className="container mx-auto py-8 space-y-8">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold">Billing & Subscription</h1>
//           <p className="text-muted-foreground">Manage your billing information and subscription plan</p>
//         </div>
//         <Button variant="outline" className="flex items-center gap-2">
//           <CreditCard className="h-4 w-4" />
//           Update Payment Method
//         </Button>
//       </div>

//       <div className="grid gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Current Plan</CardTitle>
//             <CardDescription>You are currently on the Pro plan</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium">Usage This Month</p>
//                   <p className="text-sm text-muted-foreground">7.2GB of 10GB used</p>
//                 </div>
//                 <Progress value={72} className="w-[200px]" />
//               </div>
//               <div className="flex items-center gap-4">
//                 <Badge variant="secondary" className="px-3 py-1">
//                   Next Billing: May 1, 2024
//                 </Badge>
//                 <Badge variant="secondary" className="px-3 py-1">
//                   Monthly Plan
//                 </Badge>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Tabs defaultValue="plans" className="space-y-4">
//           <TabsList>
//             <TabsTrigger value="plans" className="flex items-center gap-2">
//               <Zap className="h-4 w-4" />
//               Plans
//             </TabsTrigger>
//             <TabsTrigger value="usage" className="flex items-center gap-2">
//               <Activity className="h-4 w-4" />
//               Usage
//             </TabsTrigger>
//             <TabsTrigger value="history" className="flex items-center gap-2">
//               <History className="h-4 w-4" />
//               Billing History
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="plans" className="space-y-4">
//             <div className="grid md:grid-cols-3 gap-6">
//               {plans.map((plan) => (
//                 <Card key={plan.name} className={`relative ${plan.current ? 'border-primary' : ''}`}>
//                   {plan.current && (
//                     <div className="absolute -top-3 left-1/2 -translate-x-1/2">
//                       <Badge className="bg-primary text-primary-foreground">Current Plan</Badge>
//                     </div>
//                   )}
//                   <CardHeader>
//                     <CardTitle>{plan.name}</CardTitle>
//                     <CardDescription>
//                       <span className="text-2xl font-bold">{plan.price}</span>
//                       /month
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <ul className="space-y-2">
//                       {plan.features.map((feature) => (
//                         <li key={feature} className="flex items-center gap-2">
//                           <Check className="h-4 w-4 text-primary" />
//                           {feature}
//                         </li>
//                       ))}
//                     </ul>
//                   </CardContent>
//                   <CardFooter>
//                     <Button
//                       className="w-full"
//                       variant={plan.current ? "outline" : "default"}
//                       onClick={() => setSelectedPlan(plan.name.toLowerCase())}
//                     >
//                       {plan.current ? "Current Plan" : "Upgrade"}
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>

//           <TabsContent value="usage">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Resource Usage</CardTitle>
//                 <CardDescription>Monitor your resource consumption</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-6">
//                   <div>
//                     <div className="flex justify-between mb-2">
//                       <span>Storage</span>
//                       <span>7.2GB / 10GB</span>
//                     </div>
//                     <Progress value={72} />
//                   </div>
//                   <div>
//                     <div className="flex justify-between mb-2">
//                       <span>API Calls</span>
//                       <span>85K / 100K</span>
//                     </div>
//                     <Progress value={85} />
//                   </div>
//                   <div>
//                     <div className="flex justify-between mb-2">
//                       <span>Projects</span>
//                       <span>8 / 10</span>
//                     </div>
//                     <Progress value={80} />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="history">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Payment History</CardTitle>
//                 <CardDescription>View your recent payments and invoices</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {[
//                     { date: "Apr 1, 2024", amount: "$29.00", status: "Paid", invoice: "#INV-2024-004" },
//                     { date: "Mar 1, 2024", amount: "$29.00", status: "Paid", invoice: "#INV-2024-003" },
//                     { date: "Feb 1, 2024", amount: "$29.00", status: "Paid", invoice: "#INV-2024-002" },
//                     { date: "Jan 1, 2024", amount: "$29.00", status: "Paid", invoice: "#INV-2024-001" },
//                   ].map((payment) => (
//                     <div
//                       key={payment.invoice}
//                       className="flex items-center justify-between p-4 border rounded-lg"
//                     >
//                       <div>
//                         <p className="font-medium">{payment.date}</p>
//                         <p className="text-sm text-muted-foreground">{payment.invoice}</p>
//                       </div>
//                       <div className="flex items-center gap-4">
//                         <Badge variant="outline">{payment.status}</Badge>
//                         <span className="font-medium">{payment.amount}</span>
//                         <Button variant="ghost" size="sm">
//                           Download
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//     );
// }

export default function Page() {
  return (
    <div>
      <h1>Page</h1>
    </div>
  );
}