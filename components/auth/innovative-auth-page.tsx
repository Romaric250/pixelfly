"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, User, Sparkles } from "lucide-react";
import { signIn, signUp } from "@/lib/auth-client";
import Link from "next/link";

interface InnovativeAuthPageProps {
  mode: "signin" | "signup";
}

export function InnovativeAuthPage({ mode }: InnovativeAuthPageProps) {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isSignUp = mode === "signup";

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      setError(`Failed to ${isSignUp ? "sign up" : "sign in"} with Google`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await signUp.email({
          email,
          password,
          name,
        });
      } else {
        await signIn.email({
          email,
          password,
        });
      }
      setShowEmailModal(false);
      // Redirect will be handled by Better Auth
    } catch (err) {
      setError(isSignUp ? "Failed to create account" : "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white via-purple-50/30 to-white">
      {/* Main content */}
      <div className="pt-24 sm:pt-28 md:pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Header */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {isSignUp ? "Join PixelFly" : "Welcome Back"}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-md mx-auto leading-relaxed px-2">
                {isSignUp
                  ? "Start transforming your photos with AI-powered enhancement"
                  : "Continue your photo enhancement journey"
                }
              </p>
            </div>

            {/* Auth options */}
            <div className="space-y-3 sm:space-y-4 max-w-sm mx-auto px-4">
              {/* Google Auth */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="w-full h-12 sm:h-14 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-2xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="hidden sm:inline">Continue with Google</span>
                  <span className="sm:hidden">Google</span>
                </Button>
              </motion.div>

              {/* Divider */}
              <div className="flex items-center py-2">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-3 sm:px-4 text-sm text-gray-500">or</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              {/* Email Auth */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => setShowEmailModal(true)}
                  variant="outline"
                  className="w-full h-12 sm:h-14 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 rounded-2xl font-semibold text-base sm:text-lg"
                >
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <span className="hidden sm:inline">Continue with Email</span>
                  <span className="sm:hidden">Email</span>
                </Button>
              </motion.div>
            </div>

            {/* Switch mode */}
            <p className="text-sm sm:text-base text-gray-600 px-4">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <Link
                href={isSignUp ? "/sign-in" : "/sign-up"}
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Email Modal */}
      <Modal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title={isSignUp ? "Create Account" : "Sign In"}
      >
        <form onSubmit={handleEmailAuth} className="space-y-4 sm:space-y-6">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm sm:text-base"
            >
              {error}
            </motion.div>
          )}

          {/* Name field for signup */}
          {isSignUp && (
            <div>
              <Label htmlFor="name" className="text-gray-700 font-medium text-sm sm:text-base">
                Full Name
              </Label>
              <div className="relative mt-1 sm:mt-2">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 sm:pl-10 h-10 sm:h-12 border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl text-sm sm:text-base"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium text-sm sm:text-base">
              Email
            </Label>
            <div className="relative mt-1 sm:mt-2">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 sm:pl-10 h-10 sm:h-12 border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl text-sm sm:text-base"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <Label htmlFor="password" className="text-gray-700 font-medium text-sm sm:text-base">
              Password
            </Label>
            <div className="relative mt-1 sm:mt-2">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 sm:pl-10 pr-9 sm:pr-10 h-10 sm:h-12 border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl text-sm sm:text-base"
                placeholder={isSignUp ? "Create a password" : "Enter your password"}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm password for signup */}
          {isSignUp && (
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                Confirm Password
              </Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 sm:h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-semibold text-sm sm:text-base"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-sm sm:text-base">
                  {isSignUp ? "Creating account..." : "Signing in..."}
                </span>
              </div>
            ) : (
              <>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">
                  {isSignUp ? "Create Account" : "Sign In"}
                </span>
              </>
            )}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
