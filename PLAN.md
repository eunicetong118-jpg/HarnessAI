<\!-- /autoplan restore point: /Users/eunicetong/.gstack/projects/HarnessAI/feat-settings-page-autoplan-restore-20260504-110303.md -->
# Plan: Enhance Landing Page based on Assets Mockup

Enhance the landing page to match the high-end "Dark Modern Fintech" aesthetic described in `Assets.png`. This includes adopting a bento-grid layout, glassmorphism effects, and a new Neon Lime accent color.

## Context
The user wants to leverage specific design assets from `Assets.png` to "upgrade" the landing page. The goal is to move from a standard dark theme to a more sophisticated, "pro" look similar to modern fintech platforms like Linear or Revolut, using a bento-grid and glassmorphism.

## CEO Review Findings (Phase 1)

### Premise Challenge
- **P1: Color Pivot (Neon Lime/Charcoal) vs DESIGN.md (Pink/Purple).**
  - *Finding:* The plan proposes a total color pivot that contradicts the established design system. This risks "Frankenstein UI" where the landing page differs from the dashboard.
  - *Status:* **USER CHALLENGE** — Recommendation is to **Adapt to Existing Colors** unless a global brand update is explicitly approved.
- **P2: Bento Grid Layout.**
  - *Finding:* Structural upgrade from "floating images" to a functional grid is sound and aligns with modern fintech patterns (Linear, Revolut).
  - *Status:* **ACCEPTED**

### Strategic Insights
- **Reframe for Impact:** Reframe `DashboardPreview.tsx` as a "Savings Evidence Engine" rather than just a visual grid. Prioritize data density (Transaction Feed, Real-time Savings) over decorative glassmorphism.
- **6-Month Regret:** Neon lime high-contrast trends fade quickly. Ensure implementation includes high-contrast fallbacks and performance budgets for `backdrop-filter`.

## Design Review Findings (Phase 2)

- **Information Hierarchy:** Bento grid should lead with "Savings Evidence" (Cumulative Savings) rather than a generic "Portfolio Balance" to better convert landing page visitors.
- **Mobile Stacking:** Defined explicit mobile order: `Portfolio/Savings` → `Breakdown` → `Transactions` → `Virtual Card`.
- **States:** Added `.glass-shimmer` for loading states and increased border-glow for hover feedback on bento cards.
- **Tone:** Recommending removal of `GoldCoinRain` or replacement with abstract "Data Stream" particles to fit the "Pro Fintech" mood.

## Engineering Review Findings (Phase 3)

- **Performance:** Limit `backdrop-filter` to primary highlights to avoid battery drain on mobile Safari.
- **Complexity:** Use a responsive charting utility (e.g., `framer-motion` for paths) rather than manual SVG calculations for the sparklines inside bento cells.
- **A11y:** Ensure Neon Lime combinations meet WCAG 4.5:1 contrast standards.

### Error & Rescue Map
| Scenario | Impact | Mitigation |
|----------|--------|------------|
| SVG Chart failure | Broken UI in Bento | Add simple placeholder or CSS-only fallback sparkline. |
| Contrast failure | Accessibility issues | Use WCAG checker on Neon Lime + Text combinations. |

### "NOT in scope" (Deferred)
- Global theme update for Dashboard/Auth pages (requires separate phase).
- Dynamic real-time data integration (mocked for now).

### What Already Exists (Leverage)
- `CalculatorSection.tsx`: Logic exists, plan only updates the skin.
- `StatsSection.tsx`: Structure exists, plan only updates colors.
- `HeroSection.tsx`: Core copy exists, plan adds CTA and "Live" pulse.

## Decision Audit Trail

| # | Phase | Decision | Classification | Principle | Rationale | Rejected |
|---|-------|----------|-----------|-----------|----------|----------|
| 1 | CEO | Adapt to existing colors | User Challenge | P5/P6 | Maintain project-wide consistency; avoid fragmentation. | - |
| 2 | Design | Savings Evidence Focus | Taste | P1 | Lead with value (savings) over status (balance) for conversion. | - |
| 3 | Design | Remove GoldCoinRain | Taste | P5 | Literal coins look "cheap" vs the new pro-fintech aesthetic. | - |
| 4 | Eng | Limit Glassmorphism | Mechanical | P2 | Prevent layout performance lag on mobile Safari. | - |



### 1. Theme & Styles
- **`tailwind.config.ts`**:
    - Add `design-lime: '#ADFF00'` (Neon Lime).
    - Add `design-charcoal: '#0A0A0A'`.
    - Update `design-bg` to `#0A0A0A`.
- **`app/globals.css`**:
    - Add `.glass-card` utility class for background-blur and translucent borders.

### 2. Component Refactoring
- **`components/landing/HeroSection.tsx`**:
    - Update primary CTA button to use `design-lime` with black text.
    - Enhance "Live" indicator with `design-lime` pulse.
    - Refine floating elements with deeper glassmorphism.
- **`components/landing/DashboardPreview.tsx`**:
    - **Rewrite** as a Bento-grid layout.
    - **Portfolio Card**: Large card (col-span-2) with balance and a glowing SVG line chart (using `design-lime`).
    - **Transaction Feed**: Vertical list (row-span-2) with activity icons and green/red indicators.
    - **Virtual Card**: Sleek dark card (col-span-1) with `design-purple` holographic gradients.
    - **Breakdown Card**: Donut chart or progress rings (col-span-1).
- **`components/landing/StatsSection.tsx`**:
    - Update value colors to `design-lime`.
    - Add translucent borders and subtle glows.
- **`components/landing/CalculatorSection.tsx`**:
    - Modernize the range slider.
    - Use `design-lime` for the "You Could Save" output.

### 3. Orchestration
- **`app/page.tsx`**:
    - Ensure background meshes and `GoldCoinRain` align with the new charcoal theme.

## Verification Plan
1. **Visual Audit**: Run dev server at port 3005 and inspect the landing page.
2. **Color Check**: Verify `design-lime` is used for primary actions and savings data.
3. **Layout Check**: Verify `DashboardPreview` uses a bento grid on desktop and stacks gracefully on mobile.
4. **Consistency**: Ensure all components (Stats, Calculator, CTA) follow the new palette and glassmorphism rules.
