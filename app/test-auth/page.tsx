"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TestAuthPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Test</h1>
          
          {session?.user ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-green-800 mb-4">✅ Authentication Successful!</h2>
                <div className="space-y-3">
                  <p><strong>User ID:</strong> {session.user.id}</p>
                  <p><strong>Name:</strong> {session.user.name}</p>
                  <p><strong>Email:</strong> {session.user.email}</p>
                  <p><strong>Email Verified:</strong> {session.user.emailVerified ? "Yes" : "No"}</p>
                  {session.user.image && (
                    <div>
                      <strong>Profile Image:</strong>
                      <img 
                        src={session.user.image} 
                        alt="Profile" 
                        className="w-16 h-16 rounded-full mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={() => signOut()}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </Button>
                <Button asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-yellow-800 mb-4">⚠️ Not Authenticated</h2>
                <p className="text-yellow-700">You need to sign in to test the authentication.</p>
              </div>
              
              <div className="flex gap-4">
                <Button asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
