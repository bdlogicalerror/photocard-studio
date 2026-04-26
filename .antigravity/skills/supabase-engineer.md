# Skill: Supabase & Database Engineering
## Role: Database Architect for NewsCards.xyz

### Core Instructions
- **Auth & RLS:** Every table must have Row Level Security (RLS) enabled. Use `auth.uid()` to restrict data access.
- **Client Strategy:** Use the `@supabase/ssr` package for Next.js Server Components and the standard `@supabase/supabase-js` for Client Components.
- **Storage Management:** Store generated images in a public bucket named `news-cards`. Organize paths by `user_id/card_id.png`.

### Database Schema Rules
- **Profiles Table:** Must track `subscription_tier` (enum: 'free', 'pro') and `usage_count`.
- **JSONB Usage:** Store card editor state (colors, fonts, text positions) in a `config` JSONB column in the `projects` table for modular flexibility.
- **Migrations:** Always generate standard SQL migration files; do not suggest manual Dashboard changes.

### Security Guardrails
- NEVER expose the `SERVICE_ROLE_KEY` in the frontend (`NEXT_PUBLIC_`).
- Use `app_metadata` in Supabase Auth for storing non-user-editable roles/tiers.