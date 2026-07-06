# API Route Evolution

- **Old:** Single API endpoint `/api/concepts` returning a flat list of concepts.
- **New:** Decoupled routes:
  - `/api/concepts` (supports search and pagination)
  - `/api/digest` (generates weekly snapshot data)
  - `/api/sync` (triggers trend scraping and LLM schema updates)