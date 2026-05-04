"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      // We show success even if the user is not found to prevent account enumeration
      setSuccess(true);
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
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
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">Reset Password</h1>
          <p className="text-gray-400 font-medium">Enter your email to receive a reset link</p>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center"
          >
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-sm backdrop-blur-md">
              If an account exists for that email, we have sent a password reset link.
            </div>
            <Link href="/login">
              <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 mt-4">
                Back to Login
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-design-pink to-design-purple text-white mt-6 shadow-lg shadow-design-pink/20 relative group overflow-hidden border-none"
              disabled={isLoading}
              isLoading={isLoading}
            >
              <span className="relative z-10">Send Reset Link</span>
              <motion.div
                className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
              />
            </Button>

            <div className="text-sm text-gray-400 text-center mt-6">
              Remember your password?{" "}
              <Link href="/login" className="text-design-pink font-semibold hover:text-design-pink/80 transition-colors">
                Log in
              </Link>
            </div>
          </form>
        )}
      </div>
    </Card>
  );
}
