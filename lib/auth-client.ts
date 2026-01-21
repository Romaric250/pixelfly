"use client"


import { createAuthClient } from "better-auth/react"

// Get the base URL for auth - should always point to the Next.js app, not the backend
function getAuthBaseURL(): string {
  // In browser, always use window.location.origin to get the current app URL
  // This ensures auth requests go to the Next.js app, not the backend
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // For SSR, use environment variable but ensure it's not the backend URL
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  // Safety check: if env URL points to backend (port 5000), ignore it
  if (envUrl && envUrl.includes(':5000')) {
    console.warn('⚠️ NEXT_PUBLIC_APP_URL points to backend (port 5000). Using default Next.js app URL instead.');
    return process.env.NODE_ENV === 'production'
      ? 'https://pixelfly-pi.vercel.app'
      : 'http://localhost:3000';
  }
  
  return envUrl || (
    process.env.NODE_ENV === 'production'
      ? 'https://pixelfly-pi.vercel.app'
      : 'http://localhost:3000'
  );
}

export const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient

// to fixed some buggy code here later on. 