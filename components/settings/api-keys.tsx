"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Plus } from "lucide-react";

export function ApiKeys() {
  const apiKeys = [
    { name: "Production API Key", key: "pk_live_**********************", created: "2024-01-15", active: true },
    { name: "Development API Key", key: "pk_test_**********************", created: "2024-02-01", active: true },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>Manage your API keys for development and production</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button className="w-full" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Generate New API Key
        </Button>
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.key} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{apiKey.name}</span>
                  <Badge variant={apiKey.active ? "default" : "secondary"}>
                    {apiKey.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Input value={apiKey.key} readOnly />
              <p className="text-sm text-muted-foreground">Created on {apiKey.created}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}