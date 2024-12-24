"use client";

import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <UserButton afterSignOutUrl="/" />;
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