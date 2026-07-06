# System Architecture

## Why it exists
To define the layout and interaction patterns between Next.js 15, Supabase, and the NVIDIA NIM pipeline.

## When it was introduced
Established in 2025, upgraded during the V2 refactoring in 2026.

## What problem it solved
It ensures decoupling of the client frontend, database persistence layer, and background AI inference processing.

## Alternative ideas discussed
- Serverless edge functions for database mutations. Dismissed due to cold start latencies and complex connections to PostgreSQL.

## Why the final decision was chosen
Next.js App Router API endpoints combined with Supabase Node client SDKs provide stable, fast connections with minimal latency.

## Future possibilities
- Distributing read traffic using a global CDN caching strategy.