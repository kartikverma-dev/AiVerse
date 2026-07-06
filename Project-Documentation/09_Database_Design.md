# Database Design

## Why it exists
To document the Supabase PostgreSQL database tables, columns, indexes, and Row Level Security (RLS) policies.

## When it was introduced
Implemented in 2025.

## What problem it solved
It ensures persistent storage of concepts, evolutions, sources, trend snapshots, and digests with high lookup speeds.

## Alternative ideas discussed
- Using a graph database like Neo4j. Dismissed because PostgreSQL is easier to host, highly robust, and relationship queries are fast enough using recursive CTEs.

## Why the final decision was chosen
A relational schema with parent/child mapping tables (`concept_evolutions`) and GIN indexing for text search provides maximum stability and performance.

## Future possibilities
- Automatic vector embedding updates on PostgreSQL using pgvector and edge function hooks.