# Day 3: NVIDIA NIM API Integration

- **What changed:** Hooked up Llama-3.3-70B model endpoints to dynamically draft new concept tables and evaluate trends.
- **Why it changed:** Automated curation helper.
- **Problems faced:** LLM returned invalid JSON formats occasionally.
- **Solution:** Added structured outputs schema configuration and validation retry loops.
- **Next goals:** Upgrade the UI components to V2 design.