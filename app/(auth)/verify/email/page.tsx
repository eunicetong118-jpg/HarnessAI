"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("uid");

    if (!token || !userId) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, userId }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed. The link may have expired.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("An unexpected error occurred. Please try again later.");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <Card className="bg-white/5 backdrop-blur-3xl border-white/10 text-white shadow-2xl p-8 max-w-md w-full relative overflow-hidden group">
      {/* Liquid glass reflection effect */}
      <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />

      <div className="flex flex-col items-center space-y-6 text-center relative z-10">
        {status === "loading" && (
          <>
            <div className="relative">
              <div className="absolute inset-0 bg-design-pink/20 blur-xl rounded-full" />
              <Loader2 className="h-12 w-12 text-design-pink animate-spin relative z-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Verifying Email</h1>
              <p className="text-gray-400">Please wait while we verify your email address...</p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
              <CheckCircle2 className="h-12 w-12 text-green-500 relative z-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Verification Successful</h1>
              <p className="text-gray-400">{message}</p>
            </div>
            <Link href="/login" className="w-full">
              <Button className="w-full bg-gradient-to-r from-design-pink to-design-purple text-white border-none h-12 text-lg font-bold">
                Go to Login
              </Button>
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
              <XCircle className="h-12 w-12 text-red-500 relative z-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Verification Failed</h1>
              <p className="text-gray-400">{message}</p>
            </div>
            <Link href="/signup" className="w-full">
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white h-12 text-lg font-bold">
                Back to Signup
              </Button>
            </Link>
          </>
        )}
      </div>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-design-bg p-4 relative overflow-hidden">
      {/* Background Mesh (same as signup) */}
      <div className="absolute top-0 left-0 right-0 h-full bg-[radial-gradient(circle_at_50%_0%,rgba(236,72,153,0.1),transparent_50%)] pointer-events-none" />

      <Suspense fallback={
        <Card className="bg-white/5 backdrop-blur-3xl border-white/10 text-white shadow-2xl p-8 max-w-md w-full">
          <div className="flex flex-col items-center space-y-6 text-center">
            <Loader2 className="h-12 w-12 text-design-pink animate-spin" />
            <h1 className="text-2xl font-bold tracking-tight">Loading...</h1>
          </div>
        </Card>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
