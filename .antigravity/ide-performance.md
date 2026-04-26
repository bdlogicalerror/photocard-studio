# IDE & Environment Performance
- **Docker Architecture:** All services (Frontend, Backend, DB) must run in Docker containers.
- **Data Offloading (MacSSD):** - Use `/mnt/storage/Docker_MBAM1/photo_card_volume` as the host source for persistent data.
    - Mount `node_modules` and Python `site-packages` as named volumes or bind mounts on the SSD to prevent internal SSD wear.
- **Development Flow:** Use `docker-compose.dev.yml` for hot-reloading. Ensure `watch` mode is enabled for Next.js and `--reload` for FastAPI.
- **Network:** Use the Tailscale MagicDNS or Tailscale IP within Docker networks for cross-device database/API testing.
- **AI Context Filtering:** Explicitly ignore `**/node_modules/**`, `**/.next/**`, `**/__pycache__/**`, and `**/.venv/**` in Antigravity settings to maintain high indexing speed.
