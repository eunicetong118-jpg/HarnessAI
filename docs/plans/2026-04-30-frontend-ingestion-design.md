# Design Doc: Frontend UI Ingestion & V4 Application

**Date:** 2026-04-30
**Status:** Approved

## Goal
Ingest UI designs from "Frontend components" and apply them to the V4 rebate portal, maintaining the pink/purple theme while ensuring V4 architectural compliance.

## Approach: V4-Integrated Refactor
- Port RTF components to TSX in `components/landing/`.
- Update `tailwind.config.ts` with design colors.
- Ensure mobile-first responsiveness.
- Use USD for all currency displays.

## Components
- `HeroSection.tsx`: Responsive two-column layout.
- `DashboardPreview.tsx`: Interactive preview with growth graph.
- `CalculatorSection.tsx`: Volume-based savings calculator.
- `LiveFeed.tsx`: Recent user savings activity.
- `CTASection.tsx`: Final signup push.

## Theme Configuration
- Background: `#0f0b1f`
- Primary Accent: Pink-500 to Purple-600 Gradient
- Text: White (Primary), Gray-300 (Secondary)
