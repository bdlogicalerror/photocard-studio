# Frontend Standards: News-Card Generator
## Tech Stack: Next.js (App Router), Tailwind CSS, Framer Motion

### UI/UX Principles
* **Style:** Clean, modern, minimalist. Use ample whitespace and a dark-mode-first aesthetic (similar to the provided design).
* **Mobile-First:** The editor must be fully responsive. On mobile, the "Editor" sidebar should transition into a bottom sheet or a toggleable drawer.
* **Canvas:** Use HTML5 Canvas or SVG for the card preview to ensure real-time updates without server round-trips.

### Coding Rules
* **Components:** Use functional components with TypeScript. Prefer Lucide-react for icons.
* **State Management:** Use `Zustand` for global editor state (e.g., current text, font size, background image).
* **Performance:** Memoize the canvas preview component to prevent re-renders during sidebar slider adjustments.