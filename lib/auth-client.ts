"use client"


import { createAuthClient } from "better-auth/react"


export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || (
    process.env.NODE_ENV === 'production'
      ? 'https://pixelfly-pi.vercel.app'
      : 'http://localhost:3000'
  ),
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient

// to fixed some buggy code here later on. 