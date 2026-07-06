# Major Architectural Decisions

## Decision 1: Relational over Graph Database
- **Details:** Chose PostgreSQL (Supabase) instead of Neo4j for concept storage.
- **Rationale:** PostgreSQL is highly stable, includes full-text search, pgvector indexing, and relations can be traversed efficiently using recursive Common Table Expressions (CTEs).

## Decision 2: Next.js 15 App Router + Turbopack
- **Details:** Chose React Server Components (RSC) and App Router API endpoints.
- **Rationale:** Fits semantic search layout indexing, ensures fast initial page loads, and matches shadcn/ui and Framer Motion dependencies.