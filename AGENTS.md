# Mood Galaxy contributor guide

- Use `pnpm dev`, `pnpm build`, and `pnpm lint` with Node 22+.
- Keep generation deterministic: generated universe data flows through `src/generation/universe.ts`.
- Keep animation imperative inside the Three.js scene; avoid React updates per frame.
- Cap pixel ratio and retain the performance-mode path.
- Acceptance: presets are distinct; custom input, screenshot, JSON import/export, share links, keyboard controls, and reduced motion remain functional.
