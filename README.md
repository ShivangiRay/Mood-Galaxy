# Mood Galaxy

Mood Galaxy is an anonymous, local-first generative art playground. No account, API key, backend, or authentication is required.

## Play

Choose Explore, Tend a Tiny Planet, or Star Loom. The emotion presets change each world through a deterministic seed. Audio is optional and starts only after pressing Sound on.

## Controls

Use the mode switcher, emotion buttons, and tool panels. In Tiny Planet, click the world to plant and drag the cloud to rain. In Star Loom, drag stars together to weave a connection. Space pauses, R regenerates, S exports a screenshot, and M toggles sound.

## Development

Run `pnpm dev`, `pnpm build`, and `pnpm lint` using Node 22+. Core rendering is Three.js; the two relaxed games use lightweight DOM/SVG interaction layers and localStorage for local saves.
