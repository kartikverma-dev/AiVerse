# Research Methodology

Our research methodology consists of:
1. **Schema Definition:** Developing a robust database schema capturing concepts, relationships, citations, and weekly metric snapshots.
2. **Data Pipeline Construction:** Implementing synchronized scripts querying GitHub APIs (stars, activity), Google Scholar/Semantic Scholar APIs (citations), and LLM extraction templates.
3. **Status Algorithm Design:** Formulating a metric-driven heuristics model to automatically calculate concept lifecycles.
4. **Evaluation:** Comparing algorithm-generated status classifications with consensus judgments from a panel of technical curators.