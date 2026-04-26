# Skill: Modular Frontend Development
## Context: Next.js Studio (newscards.xyz/studio)

### Theme Standards
- **Implementation:** Use `next-themes` with `ThemeProvider`.
- **System Preference:** Default to `system` but provide a toggle in the TopBar.
- **Color Tokens:**
  - `bg-background`: Light (Zinc-50) | Dark (Zinc-950)
  - `bg-card`: Light (White) | Dark (Zinc-900/80)
  - `border`: Light (Zinc-200) | Dark (Zinc-800)

### Component Modularity
- **Prop Injection:** Every module in the Sidebar (Text, Assets, Effects) must accept a `state` and `setState` prop from the parent Studio context.
- **Canvas Rendering:** The preview card must be a standalone component `<NewsCardPreview />` that renders based on the shared JSON state.
- **Mobile Logic:** - Desktop: Sidebar is fixed at `w-80`.
  - Mobile: Sidebar transforms into a horizontal "Toolbar" at the bottom using `overflow-x-auto`.

### Performance
- Use `useDeferredValue` for the card text to ensure the UI doesn't lag while the user is typing on the canvas.