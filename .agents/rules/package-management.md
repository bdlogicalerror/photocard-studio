---
trigger: always_on
---

# Rule: Container-First Dependency Management

## 1. Frontend (Next.js) Policy
- **NO DIRECT NPM/YARN:** Do not run `npm install` or `yarn add` on the host machine.
- **Package Addition:** 1. Manually append the dependency and version to `frontend/package.json`.
    2. Run `docker-compose -f docker-compose.yml up --build frontend`.
- **SSD Persistence:** Since `node_modules` is mapped to `/mnt/storage/Docker_MBAM1/photo_card_volume/frontend/node_modules`, the agent MUST check if the volume is mounted before starting the build.
- **Verification:** After the container starts, the agent must execute `docker-compose logs -f frontend` to monitor the Next.js compilation. If "Module not found" or "Conflict" appears, the agent must fix `package.json` and repeat.

## 2. Backend (FastAPI) Policy
- **NO DIRECT PIP:** Do not use `pip install` on the host or inside a local venv.
- **Package Addition:**
    1. Append the library name (and version if known) to `backend/requirements.txt`.
    2. Run `docker-compose -f docker-compose.yml up --build backend`.
- **SSD Persistence:** Dependencies are offloaded to `/mnt/storage/Docker_MBAM1/photo_card_volume/backend/site-packages`. 
- **Verification:** Monitor `docker-compose logs -f backend`. If `ImportError` or `Uvicorn` crash loops occur, adjust `requirements.txt` or `main.py` and rebuild.

## 3. Failure Recovery Loop
1. **Trigger:** Build fails or log shows error.
2. **Action:** Agent reads the LAST 50 lines of logs using `docker logs --tail 50 [container_name]`.
3. **Fix:** Apply code/config changes.
4. **Iterate:** Re-run the `--build` command. The agent is forbidden from proceeding until the logs show:
   - Frontend: `ready - started server on 0.0.0.0:3003`
   - Backend: `Uvicorn running on http://0.0.0.0:8003`