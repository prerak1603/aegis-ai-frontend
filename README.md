# Aegis AI — Frontend

A standalone Next.js frontend for the Aegis AI network intrusion detection
API. Replaces the Streamlit dashboard for client-facing demos.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** — design tokens defined in `app/globals.css`
- **React Three Fiber + drei** — the 3D flow visualization on the landing page
- **Framer Motion** — entrance/count-up animations
- **Recharts** — attack breakdown chart
- **Fontsource** (IBM Plex Sans/Mono) — self-hosted fonts, no external font
  request at runtime

## Architecture note: how the API key stays secret

The browser **never** calls `aegis-ai-v2.onrender.com` directly and never
sees your API key. Instead:

```
Browser → /api/analyze (this app's own server) → aegis-ai-v2.onrender.com
```

`app/api/analyze/route.ts` and `app/api/health/route.ts` are server-side
route handlers. They read `AEGIS_API_KEY` from an environment variable
(never bundled into client-side JavaScript) and forward the request with
the `X-API-Key` header attached server-to-server. This also sidesteps CORS
entirely, since the browser only ever talks to its own origin.

Verified: `grep`-ing the production client bundle for the API key returns
zero matches.

## Local development

```bash
npm install
cp .env.local.example .env.local
# edit .env.local — set AEGIS_API_KEY to a real customer key
npm run dev
```

## Deploying to Vercel

1. Push this project to its own GitHub repo (or a subfolder of an existing
   one — Vercel lets you set a root directory).
2. Import the repo in Vercel.
3. Under **Settings → Environment Variables**, add:
   - `AEGIS_API_KEY` — a real key from `SCRIPTS/create_customer.py`
   - `AEGIS_API_URL` — `https://aegis-ai-v2.onrender.com` (optional, this
     is already the default)
4. Deploy.

**Function timeout note:** `/analyze` can take 20-90s depending on file
size and whether Render's free instance just cold-started. The route sets
`export const maxDuration = 60` — check your current Vercel plan's actual
cap for serverless functions and raise it if needed. Once Render is on a
paid tier (no cold starts), this stops being a concern.

## What's built

- Landing page with the 3D flow visualization, pipeline explainer, and
  model stats
- `/audit` — upload a CICFlowMeter CSV, see live engine status, get full
  results: summary metrics, attack breakdown chart, and the AI agent
  threat-analysis cards (severity, attribution, narrative, recommendation)

## What's not built yet (intentionally out of scope for this pass)

- PDF report export (the Streamlit version had this via ReportLab; a
  React equivalent would use `jsPDF`/`react-pdf` client-side, or a
  serverless function — worth a follow-up pass)
- Past reports / history view (the backend already has `/history/uploads`
  and `/history/detections` — just needs a page wired up)
- Multi-customer self-serve (this app currently authenticates as a single
  dashboard identity via one shared `AEGIS_API_KEY`)
