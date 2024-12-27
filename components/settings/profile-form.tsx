"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Building } from "lucide-react";
import { InputWithIcon } from "@/components/settings/input-with-icon";

export function ProfileForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your profile details and public information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Button variant="outline">Change Photo</Button>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <InputWithIcon id="name" placeholder="John Doe" icon={<User className="h-4 w-4" />} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <InputWithIcon id="email" type="email" placeholder="john@example.com" icon={<Mail className="h-4 w-4" />} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company">Company</Label>
            <InputWithIcon id="company" placeholder="Pixcelfly Inc." icon={<Building className="h-4 w-4" />} />
          </div>
        </div>
        <Button>Save Changes</Button>
      </CardContent>
    </Card>
  );
}