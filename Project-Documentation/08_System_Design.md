# System Design

## Why it exists
To map the components, directories, state management, and user interaction flows.

## When it was introduced
Designed in 2025.

## What problem it solved
It provided clear guidelines for component boundaries, preventing spaghetti code in the D3.js and Framer Motion modules.

## Alternative ideas discussed
- Using Redux for global state. Dismissed because simple local states and React hooks are sufficient and more performant.

## Why the final decision was chosen
A folder-based architecture (`components/`, `hooks/`, `lib/`, `app/`) keeps the codebase modular and readable.

## Future possibilities
- Web worker integration to process D3 force graph math off the main thread.