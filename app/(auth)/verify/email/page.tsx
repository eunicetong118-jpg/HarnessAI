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
    <Card className="bg-[#12121A] border-zinc-800 text-white shadow-xl p-8 max-w-md w-full">
      <div className="flex flex-col items-center space-y-6 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Verifying Email</h1>
              <p className="text-zinc-400">Please wait while we verify your email address...</p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Verification Successful</h1>
              <p className="text-zinc-400">{message}</p>
            </div>
            <Link href="/login" className="w-full">
              <Button className="w-full bg-white text-black hover:bg-zinc-200">
                Go to Login
              </Button>
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-12 w-12 text-red-500" />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Verification Failed</h1>
              <p className="text-zinc-400">{message}</p>
            </div>
            <Link href="/signup" className="w-full">
              <Button variant="outline" className="w-full border-zinc-800 hover:bg-zinc-900 text-white">
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
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F] p-4">
      <Suspense fallback={
        <Card className="bg-[#12121A] border-zinc-800 text-white shadow-xl p-8 max-w-md w-full">
          <div className="flex flex-col items-center space-y-6 text-center">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            <h1 className="text-2xl font-bold">Loading...</h1>
          </div>
        </Card>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
