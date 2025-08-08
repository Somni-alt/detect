# Detect (clean Vercel build)

## Deploy sur Vercel
1. Variables d'env (Production + Preview) :
   - `DATABASE_URL` = `postgresql://...neon.../neondb?sslmode=require`
   - `THRESHOLD_GREEN` = `0.75`
   - `THRESHOLD_ORANGE` = `0.45`
2. Build Command (Project Settings → Build & Development Settings) :
   ```
   npx prisma generate && npx prisma db push && next build
   ```
3. **Deploy**.

## API
- `POST /api/jobs` body JSON:
  ```json
  {"title":"Dev Backend Node","description":"Node, Postgres, Docker","must_have":["node","postgres","docker"]}
  ```
- `POST /api/jobs/{jobId}/ingest` form-data:
  - key `files` → un ou plusieurs fichiers (PDF/DOCX/TXT)
