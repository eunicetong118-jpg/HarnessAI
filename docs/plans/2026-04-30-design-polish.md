# Design Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Polish the landing page design by unifying backgrounds, refactoring the hero layout, and enhancing typography.

**Architecture:** Update Tailwind config for unified theme and typography, and refactor `HeroSection.tsx` for a 2-column desktop layout.

**Tech Stack:** Next.js 14, Tailwind CSS.

---

### Task 1: Unify Background Colors & Add Display Font

**Files:**
- Modify: `tailwind.config.ts`

**Step 1: Set unified background and add font-family**

```typescript
// Update theme.extend.colors
'design-bg': '#0f0b1f', // Design intent

// Add to theme.extend
fontFamily: {
  display: ['Inter', 'system-ui', 'sans-serif'], // Placeholder for purposeful display font
},
```

**Step 2: Commit**

```bash
git add tailwind.config.ts
git commit -m "style: unify design background and add display font stack"
```

---

### Task 2: Refactor HeroSection to 2-Column Split

**Files:**
- Modify: `components/landing/HeroSection.tsx`

**Step 1: Refactor layout**

```tsx
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="py-20 px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="text-left">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white font-display">
            Real Traders Don't Just Earn.
            <br />
            <span className="text-design-pink">They Save.</span>
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-xl">
            High-performance brokerage rebate portal. Get paid 80% on every trade.
          </p>
          <div className="mt-10">
            <Link
              href="/signup"
              className="bg-gradient-to-r from-design-pink to-design-purple px-10 py-5 rounded-2xl font-bold text-white inline-block hover:scale-105 transition-transform"
            >
              Start Saving Now
            </Link>
          </div>
        </div>
        <div className="hidden md:block bg-gradient-to-br from-design-surface to-design-card h-[500px] rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-design-pink/10 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add components/landing/HeroSection.tsx
git commit -m "style: refactor hero section to 2-column split layout"
```

---

### Task 3: Update Global Styles for Unified Background

**Files:**
- Modify: `app/globals.css`

**Step 1: Ensure body background is consistent**

```css
body {
  background-color: #0f0b1f; /* design-bg */
}
```

**Step 2: Commit**

```bash
git add app/globals.css
git commit -m "style: apply unified background color to global styles"
```
