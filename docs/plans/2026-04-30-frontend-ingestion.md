# Frontend UI Ingestion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ingest UI design components and apply them to the landing page with V4 standards.

**Architecture:** Port RTF designs to TSX components in `components/landing/`, update Tailwind config for the theme, and replace `app/page.tsx` content.

**Tech Stack:** Next.js 14, Tailwind CSS, Lucide React (icons), Framer Motion.

---

### Task 1: Update Tailwind Configuration

**Files:**
- Modify: `tailwind.config.ts`

**Step 1: Add design colors to theme**

```typescript
// Add to theme.extend.colors
colors: {
  'design-bg': '#0f0b1f',
  'design-surface': '#15102b',
  'design-card': '#1e183d',
  'design-pink': '#ec4899', // pink-500
  'design-purple': '#9333ea', // purple-600
}
```

**Step 2: Commit**

```bash
git add tailwind.config.ts
git commit -m "style: add landing page design colors to tailwind config"
```

---

### Task 2: Implement HeroSection Component

**Files:**
- Create: `components/landing/HeroSection.tsx`

**Step 1: Write component with responsive layout**

```tsx
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="text-center py-16 px-4">
      <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white">
        Real Traders Don't Just Earn.
        <br />
        <span className="text-design-pink">They Save.</span>
      </h1>
      <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
        Trade with near-zero cost. Start saving from your first trade.
      </p>
      <div className="mt-8">
        <Link
          href="/signup"
          className="bg-gradient-to-r from-design-pink to-design-purple px-8 py-4 rounded-xl font-semibold text-white inline-block hover:opacity-90 transition-opacity"
        >
          Start Saving Now
        </Link>
      </div>
      <p className="text-sm mt-4 text-gray-400">
        No deposit required • Works with your broker
      </p>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add components/landing/HeroSection.tsx
git commit -m "feat: implement HeroSection component"
```

---

### Task 3: Implement DashboardPreview Component

**Files:**
- Create: `components/landing/DashboardPreview.tsx`

**Step 1: Write component with growth simulation**

```tsx
"use client";
import { useEffect, useState } from "react";

export default function DashboardPreview() {
  const [balance, setBalance] = useState(18420);

  useEffect(() => {
    const interval = setInterval(() => {
      setBalance((b) => b + Math.floor(Math.random() * 50));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-design-surface rounded-2xl p-6 shadow-xl max-w-4xl mx-auto my-12 border border-white/5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Your Savings Dashboard</h2>
        <span className="text-green-400 text-sm">+$12.50 today</span>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-design-card p-6 rounded-xl border border-white/5">
          <p className="text-gray-400 text-sm">Total Saved</p>
          <h3 className="text-3xl font-bold text-design-pink">
            ${(balance / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
        </div>
        <div className="bg-design-card p-6 rounded-xl md:col-span-2 border border-white/5">
          <p className="text-gray-400 text-sm mb-2">Savings Growth</p>
          <div className="h-32 bg-gradient-to-r from-design-purple to-design-pink rounded-lg opacity-40"></div>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add components/landing/DashboardPreview.tsx
git commit -m "feat: implement DashboardPreview component"
```

---

### Task 4: Implement CalculatorSection Component

**Files:**
- Create: `components/landing/CalculatorSection.tsx`

**Step 1: Write component with volume savings logic**

```tsx
"use client";
import { useState } from "react";

export default function CalculatorSection() {
  const [volume, setVolume] = useState(100); // Lots

  const savings = volume * 8.5; // Example $8.5 per lot rebate

  return (
    <section className="my-16 max-w-2xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">See How Much You Could Save</h2>
      <div className="bg-design-surface p-8 rounded-2xl border border-white/5">
        <input
          type="range"
          min="1"
          max="1000"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full accent-design-pink"
        />
        <div className="flex justify-between mt-4 text-gray-400">
          <span>Monthly Trading Volume: {volume} Lots</span>
        </div>
        <div className="mt-8 text-center">
          <p className="text-gray-400">Estimated Monthly Savings</p>
          <h3 className="text-4xl font-bold text-design-pink mt-2">
            ${savings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add components/landing/CalculatorSection.tsx
git commit -m "feat: implement CalculatorSection component"
```

---

### Task 5: Update Landing Page

**Files:**
- Modify: `app/page.tsx`

**Step 1: Replace content with new components**

```tsx
import HeroSection from "@/components/landing/HeroSection";
import DashboardPreview from "@/components/landing/DashboardPreview";
import CalculatorSection from "@/components/landing/CalculatorSection";

export default function Page() {
  return (
    <main className="bg-design-bg text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <HeroSection />
        <DashboardPreview />
        <CalculatorSection />
      </div>
    </main>
  );
}
```

**Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: update landing page with new design components"
```
