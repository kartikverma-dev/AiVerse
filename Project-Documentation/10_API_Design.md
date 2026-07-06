# API Design

## Why it exists
To detail the HTTP API endpoints (`/api/concepts`, `/api/digest`, `/api/generate`) and schema types.

## When it was introduced
Implemented in 2025.

## What problem it solved
It standardizes data communication between the Next.js frontend, curator panels, and background NVIDIA NIM generator scripts.

## Alternative ideas discussed
- GraphQL API. Dismissed because REST APIs are simpler to build, debug, and cache in Next.js.

## Why the final decision was chosen
App Router dynamic route handlers returning standard JSON responses fit the Next.js ecosystem perfectly.

## Future possibilities
- Implementing public API keys for external developer access.