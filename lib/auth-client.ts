"use client";

import { useState, useEffect } from "react";

// Mock auth functions for now
export const signIn = {
  email: async ({ email, password }: { email: string; password: string }) => {
    console.log("Mock sign in:", email);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },
  social: async ({ provider }: { provider: string }) => {
    console.log("Mock social sign in:", provider);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  }
};

export const signUp = {
  email: async ({ email, password, name }: { email: string; password: string; name: string }) => {
    console.log("Mock sign up:", email, name);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  }
};

export const signOut = async () => {
  console.log("Mock sign out");
  return { success: true };
};

export const useSession = () => {
  return {
    data: null, // No session for now
    isPending: false
  };
};

export const getSession = async () => {
  return null;
};
