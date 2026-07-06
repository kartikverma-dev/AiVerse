# Meeting & Planning Notes

- **Discussion on Click Bubbling (July 2026):**
  - *Problem:* Clicking toggles on a card triggered the card's wide onClick router push.
  - *Resolution:* Add explicit `e.stopPropagation()` handlers in `DualDepthToggle` button clicks to contain navigation actions.