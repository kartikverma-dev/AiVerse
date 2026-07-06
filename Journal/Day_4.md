# Day 4: Advanced V2 Component Upgrades

- **What changed:** Built Battle Mode comparison dashboard, Term Origin stories, and hydration-safe Count-up stats.
- **Why it changed:** Upgraded the platform's presentation to a premium look.
- **Problems faced:** Hydration mismatch on counter values due to random values on server vs client.
- **Solution:** Created the `AnimatedStat` helper which waits for client mounting before executing animations.
- **Next goals:** Setup the search overlay Command Palette.