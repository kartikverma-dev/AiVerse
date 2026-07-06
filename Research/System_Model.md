# System Model

The system model comprises four main entities:
- **Concept ($C$):** Defined by slug, metadata, technical definition, and beginner definition.
- **Evolutionary Relationship ($E$):** A directed link $C_{parent} \rightarrow C_{child}$ representing relationship types (replaced, extended, inspired_by, competes_with).
- **Metric Snapshot ($S$):** Weekly recorded parameters containing GitHub Stars ($G$), Academic Citations ($A$), and Community Mention Volume ($V$).
- **Lifecycle Status ($L$):** Calculated via a status determination function $f(G, A, V, \text{age})$.

$$\text{Maturity Score} = \alpha \log(G) + \beta \log(A) + \gamma \log(V)$$