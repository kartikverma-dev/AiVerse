# Experimental Results

## Classification Alignment
In our initial testing run across 15 seed concepts:
- **True Positive Alignment:** 13 out of 15 concepts matched the consensus evaluation of the architects.
- **Mismatches:** 2 concepts (GEO classified as emerging instead of growing; RAG classified as stable instead of growing).
- **F1 Score:** $0.867$ (Needs Validation with larger datasets).

## Performance Metrics
- **Initial page render time:** 37.1s during server boot, dropping to $< 200$ms on client-side route transitions.
- **Graph interaction FPS:** Stable 60 FPS for graphs up to 250 nodes (rendered via SVGs).