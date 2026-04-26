# Skill: Advanced Request Verification & Guest Protection
## Strategy: Multi-Tiered "Proof-of-Origin"

### 1. Guest User Protection (Proof-of-Human)
Since Guests lack a Supabase JWT, use **Cloudflare Turnstile** or **Google reCAPTCHA v3** to prevent scrapers from draining your GPU/Rendering resources.
- **Frontend:** Generate a `turnstile_token` before calling the `/generate` API.
- **Backend:** Reject any request from a Guest that doesn't include a valid, non-expired Turnstile token in the headers.

### 2. The "Localhost" Attack Defense
Attackers often spoof `localhost` to bypass CORS. 
- **The Rule:** [`localhost:3001`,`localhost:3002`,`localhost:8001`,`localhost:8002`] should ONLY be allowed in the Backend when `ENVIRONMENT=development`. 
- **Production Logic:** In the Production FastAPI config, the `ALLOW_ORIGINS` list must be strictly hardcoded to `https://newscards.xyz`. Any request claiming to be from `localhost` in production must be dropped immediately.

### 3. Signed Request Payloads (Proof-of-App)
To ensure the request came from *your* Next.js code and not a scraper script:
- **Secret Handshake:** Use a `SHARED_APP_SECRET` (Server-only env var in Next.js).
- **Signature:** For Guest users, the Next.js **Server Action** (Proxy) should sign the request timestamp using HMAC-SHA256: `Signature = HMAC(timestamp, SHARED_APP_SECRET)`.
- **Backend Check:** FastAPI verifies the signature and checks if the timestamp is older than 30 seconds. This prevents "Replay Attacks" where an attacker re-uses a captured request.

### 4. Rate Limiting (The Last Line)
- **Authenticated:** 60 requests/hour (Stored in Supabase `profiles`).
- **Guest:** 3 requests/hour per IP (Stored in Redis or memory).