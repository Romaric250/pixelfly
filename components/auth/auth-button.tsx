"use client";

import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AuthButton() {
  // const { isSignedIn } = useAuth();

  const isSignedIn = true

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        {/* <UserButton afterSignOutUrl="/" /> */}
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <SignInButton mode="modal">
        <Button variant="ghost">Sign In</Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button>Get Started</Button>
      </SignUpButton>
    </div>
  );
}