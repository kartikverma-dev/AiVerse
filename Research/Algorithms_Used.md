# Algorithms and Formulas

## Status Forecasting Heuristics
The platform evaluates the concept lifecycle status using the following algorithm:

1. **Velocity Calculation:**
   $$\Delta_{\text{metric}} = \frac{\text{Metric}_{\text{current}} - \text{Metric}_{\text{prior}}}{\text{Metric}_{\text{prior}}}$$

2. **Heuristic Rules:**
   - **Emerging:** Low total citations ($A < 50$), but high weekly velocity ($\Delta_V > 0.5$) and age $< 1$ year.
   - **Growing:** High star velocity ($\Delta_G > 0.2$), increasing citations, and age $< 2$ years.
   - **Stable:** High absolute metrics ($G > 5000$, $A > 200$), low volatility ($|\Delta_G| < 0.05$).
   - **Declining:** Negative velocity across all channels ($\Delta_G < -0.1$, $\Delta_V < -0.2$) for 3 consecutive snapshots.
   - **Historical:** Superseded by a "replaced" child concept relationship in $E$.