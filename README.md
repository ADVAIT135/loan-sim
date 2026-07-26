# Loan Decision Simulator

Live site: [Loan Decision Simulator](https://regulatorloansimulator.netlify.app/)

A small single-page app that demonstrates a hybrid rules + explainable ML loan decision pipeline. It includes a client UI (Vite + React + Tailwind), serverless Netlify functions for decisions and audit logging, and a lightweight explainable scoring model.

---

## Quick overview (Two audiences)

### For technical readers
- Stack: Vite (React + JSX), Tailwind CSS, Node.js serverless functions (Netlify), Supabase (optional) for audit logs.
- Key files:
  - `src/` — React app (pages, components)
  - `src/lib/model.js` — scoring logic (client-side live preview)
  - `netlify/functions/decision.js` — server-side decision endpoint (scores, rules, writes audit)
  - `netlify/functions/auditProxy.js` — server-side read/write proxy for `audit_logs` (uses Supabase service role)
  - `netlify/functions/health.js` — environment health check
- Behavior: the `decision` function computes a logistic score, applies hard/soft rules, returns `approve` / `manual_review` / `decline`, and records an audit entry via `auditProxy` or direct Supabase insert.

### For banking / product readers
- Purpose: simulate a loan decision pipeline combining deterministic business rules and a transparent statistical model. It helps evaluate how model score and business rules interact to produce a final decision.
- What you can do: submit hypothetical applicants through the UI, see live model preview, and see the server decision and contribution explanations.
- Auditability: every decision is logged (audit record contains applicant snapshot, decision, model probability, feature contributions, triggered rules, and timestamp).

---

## Examples (manual inputs)
Use these values in the Submit form to reproduce manual-review / borderline cases.

- Borderline A (manual review):
  - Income: 50,000
  - Age: 30
  - Loan Amount: 43,000
  - Debt Ratio: 0.10
  - Blacklisted: unchecked
  - Region: RegionA

- Borderline B (manual review):
  - Income: 60,000
  - Age: 35
  - Loan Amount: 51,500
  - Debt Ratio: 0.15
  - Blacklisted: unchecked
  - Region: RegionA

- Region-triggered review:
  - Income: 80,000
  - Age: 45
  - Loan Amount: 20,000
  - Debt Ratio: 0.10
  - Region: RegionX (restricted)

---

## Local development

Prerequisites
- Node.js (x64 recommended, tested with Node 24+)
- npm

Commands

```bash
# install
npm install

# run dev server (hot reload)
npm run dev

# build production assets
npm run build

# serve production build locally (optional)
# install a static server, e.g. 'npm i -g serve' then:
serve -s dist
```

Notes
- If Vite picks a different port (5173 in dev), check the terminal output. Use `--host` to expose on the network.
- On Windows, prefer 64-bit Node to avoid native optional dependency issues encountered in some environments.

---

## Environment variables
Set these in your Netlify site settings (or locally in your shell when invoking serverless functions):

- `AUDIT_PROXY_URL` (optional) — absolute URL of the audit proxy. If provided the `decision` function will POST audit records there.
- `SUPABASE_URL` — Supabase REST endpoint (when using direct Supabase write).
- `SUPABASE_SERVICE_ROLE` — Supabase service_role key (server-only). Do NOT expose this key in the browser.
- `URL` — your site origin (Netlify sets this automatically).

If neither `AUDIT_PROXY_URL` nor the Supabase variables are present, the `decision` function will fail to record audit logs (it still returns a decision but logs an error).

---

## How to test and verify logs

1. Submit via UI (Submit page) using one of the example presets.
2. Open the Reviewer page and click Refresh to fetch audit logs (the client fetches `/.netlify/functions/auditProxy`).

Curl examples (server-side):

- Submit a decision (POST to the decision function)

```bash
curl -sS -X POST https://regulatorloansimulator.netlify.app/.netlify/functions/decision \
  -H 'Content-Type: application/json' \
  -d '{"applicant": {"id":"case-1","income":50000,"age":30,"loan_amount":30000,"debt_ratio":0.2,"blacklisted":false,"region":"RegionA"}, "applicantId":"case-1"}'
```

- Read logs via auditProxy (GET)

```bash
curl -sS 'https://regulatorloansimulator.netlify.app/.netlify/functions/auditProxy?limit=20&offset=0' | jq
```

> Note: `auditProxy` requires `SUPABASE_SERVICE_ROLE` set on the server (Netlify environment) to succeed.

---

## Technical details — decision logic & explainability

- Model: a logistic (sigmoid) scoring function using a small set of features with linear weights. Implemented both client-side (`src/lib/model.js`) for live preview and server-side in `netlify/functions/decision.js` for authoritative decisions.
- Rules: deterministic checks (example: `blacklisted` yields immediate decline; loan_amount/income ratio may trigger review). Rules and model contributions are packaged into the audit record.
- Explainability: the server returns `contributions` — per-feature contribution values (weight * feature value) that show how each feature affected the linear score.

For developers: change weights in `netlify/functions/decision.js` and `src/lib/model.js` to adjust behavior; run live preview in the UI to immediately observe score changes.

---

## For banking/audit teams — plain language
- Each submitted applicant receives a model probability (0–1) and a final decision.
- Hard rules (e.g., blacklisted) can override the model and cause decline.
- Borderline probabilities are flagged for manual review.
- Every decision is recorded with a timestamp and the input snapshot for auditability and traceability.

---

## Troubleshooting
- "Inputs invisible in dark mode": ensure you have the latest `src/index.css` and that the `html` element toggles the `dark` class when you use the theme toggle. Hard-refresh the page if necessary.
- "Netlify function returns 500 or Unexpected export": ensure your Node environment is 64-bit and that Netlify environment variables are configured.
- If audit logs don't appear in Reviewer: check Netlify function logs for `Audit proxy failed` or `Supabase insert failed` — environment variables may be misconfigured.

---

## Contribution & License
Contributions welcome — open a PR with clear test steps.

This repository currently follows the project license in `LICENSE`.



