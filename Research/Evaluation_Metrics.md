# Evaluation Metrics

To measure the effectiveness of CredgeAiVerse, we define the following metrics:

1. **Classification Accuracy:**
   $$\text{Accuracy} = \frac{\text{True Positives} + \text{True Negatives}}{\text{Total Evaluations}}$$

2. **Ontario Coverage:**
   $$\text{Coverage} = \frac{\text{Concepts Connected in Graph}}{\text{Total Cataloged Concepts}}$$

3. **Client Performance:**
   - Initial hydration delay (target $< 1.5$s).
   - D3 Graph render time under varying node counts (10 to 1000 nodes).