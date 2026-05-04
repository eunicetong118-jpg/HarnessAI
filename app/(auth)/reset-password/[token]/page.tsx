"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

function ResetPasswordForm() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = params.token as string;
  const userId = searchParams.get("userId");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          userId,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/5 backdrop-blur-3xl border-white/10 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative overflow-hidden group p-1">
      {/* Liquid glass light reflection */}
      <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-white/10 via-transparent to-transparent rotate-12 pointer-events-none" />

      <div className="space-y-6 relative z-10 p-4">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">New Password</h1>
          <p className="text-gray-400 font-medium">Create a new secure password for your account</p>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center"
          >
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-sm backdrop-blur-md">
              Password reset successfully! Redirecting to login...
            </div>
            <Link href="/login">
              <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 mt-4">
                Login Now
              </Button>
            </Link>
          </motion.div>
        ) : (
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
              <Label htmlFor="password" title="password" className="text-gray-300 ml-1">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={isLoading}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-design-pink/50 focus:ring-design-pink/20 h-12 rounded-xl transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" title="password" className="text-gray-300 ml-1">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
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
              <span className="relative z-10">Reset Password</span>
              <motion.div
                className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
              />
            </Button>
          </form>
        )}
      </div>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
