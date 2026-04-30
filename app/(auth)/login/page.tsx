"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
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
    <Card className="bg-design-card border-white/5 text-white shadow-xl">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-zinc-400">Log in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              disabled={isLoading}
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-zinc-700 focus:ring-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-zinc-400 hover:text-white hover:underline"
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
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-zinc-700 focus:ring-zinc-700"
            />
          </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-design-pink to-design-purple text-white hover:opacity-90 mt-4 border-none"
              disabled={isLoading}
              isLoading={isLoading}
            >
            Log In
          </Button>

          <div className="text-sm text-zinc-400 text-center mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-white hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </Card>
  );
}
