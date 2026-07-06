# Database Schema Evolution

## Version 1.0 (2025)
- Basic tables: `concepts`, `concept_evolutions`, `sources`.

## Version 2.0 (2026)
- Added `trend_snapshots` for weekly popularity trends.
- Added `digest_entries` for automatic weekly digest creation.
- Enabled Row Level Security (RLS) policies on all tables for public read-only and service-role write operations.