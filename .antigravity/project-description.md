# Project: NewsCards.xyz (Studio)
## Description
A freemium SaaS for generating professional news-style social media cards. It features a modular web-based editor (Studio) allowing users to customize text, backgrounds, and branding elements.

## Tech Stack
- **Frontend:** Next.js 14+ (App Router), Tailwind CSS, Framer Motion, Zustand.
- **Backend:** FastAPI (Python) for high-performance image processing/rendering.
- **Database/Auth:** Supabase (PostgreSQL, GoTrue, Storage).
- **Hosting:** Docker & Compose (Frontend), Docker (Backend).

## Core Modules
1. **Studio Editor:** Modular sidebar for real-time card customization.
2. **Rendering Engine:** FastAPI microservice using Pillow to bake the final high-res PNG.
3. **User Dashboard:** List of saved projects and subscription management via Stripe.

## Development Constraints
- **Design:** Modern, Minimalist, Clean.
- **Mode:** Dark/Light/System-specific themes.
- **Mobile:** Must be fully functional on mobile devices with a bottom-docked editor.
- **Timezone:** Asia/Dhaka.