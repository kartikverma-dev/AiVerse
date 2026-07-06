# Architecture Migrations

## Refactoring to V2
- **Old:** Single Client Component rendering standard cards, fetching metrics in an ad-hoc fashion.
- **New:** Decoupled architecture using shared `lib/animations.ts`, dedicated status hook `hooks/useConceptStatus.ts`, modular interactive subcomponents, and a hydration-safe count-up widget (`AnimatedStat.tsx`).