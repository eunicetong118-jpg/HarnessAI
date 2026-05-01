"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "email_not_verified") {
      setError("Please verify your email before logging in.");
    } else if (errorParam === "account_disabled") {
      setError("Your account has been disabled. Please contact support.");
    } else if (errorParam === "CredentialsSignin") {
      setError("Invalid email or password.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      console.log("Attempting login for:", email);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("Login result:", result);

      if (result?.error) {
        console.error("Login error from NextAuth:", result.error);
        setError("Invalid email or password");
      } else {
        console.log("Login success, checking role for redirect");
        // Fetch session to check role
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        console.log("Current session:", session);

        if (session?.user?.role === "ADMIN") {
          console.log("Admin role detected, redirecting to /admin");
          window.location.href = "/admin";
        } else {
          console.log("User role detected, redirecting to /dashboard");
          window.location.href = "/dashboard";
        }
      }
    } catch (err: any) {
      console.error("Unexpected login catch block:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/5 backdrop-blur-3xl border-white/10 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative overflow-hidden group">
      {/* Liquid glass light reflection */}
      <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-white/10 via-transparent to-transparent rotate-12 pointer-events-none" />

      <div className="space-y-6 relative z-10 p-1">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">Welcome Back</h1>
          <p className="text-gray-400 font-medium">Log in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm backdrop-blur-md"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300 ml-1">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              disabled={isLoading}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-design-pink/50 focus:ring-design-pink/20 h-12 rounded-xl transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <Label htmlFor="password" title="password" className="text-gray-300">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-design-pink/80 hover:text-design-pink transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              disabled={isLoading}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-design-pink/50 focus:ring-design-pink/20 h-12 rounded-xl transition-all duration-300"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full bg-gradient-to-r from-design-pink to-design-purple text-white mt-6 shadow-lg shadow-design-pink/20 relative group overflow-hidden border-none"
            disabled={isLoading}
            isLoading={isLoading}
          >
            <span className="relative z-10">Log In</span>
            <motion.div
              className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
            />
          </Button>

          <div className="text-sm text-gray-400 text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-design-pink font-semibold hover:text-design-pink/80 transition-colors">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
