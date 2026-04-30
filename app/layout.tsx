import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./lib/serialization"; // Ensure BigInt serialization is handled globally
import { SessionProvider } from "@/components/providers/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rebate Portal",
  description: "High-performance brokerage rebate portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
