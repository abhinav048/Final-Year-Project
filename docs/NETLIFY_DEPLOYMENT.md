# 🚀 Netlify Deployment Guide for SeedSure

This repository is fully **Netlify-Ready** out of the box. You can deploy it in less than 2 minutes directly from GitHub or using the Netlify CLI.

---

## ⚡ 1-Click / Git Deployment via Netlify Dashboard

1. Log in to [Netlify](https://app.netlify.com/).
2. Click **"Add new site"** → **"Import an existing project"**.
3. Select **GitHub** and choose your repository: `Final-Year-Project`.
4. Netlify will automatically detect the root [`netlify.toml`](../netlify.toml) file with the pre-configured build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **"Deploy site"**.
6. That's it! Your site will build in ~20-30 seconds and be live at `https://<your-site-name>.netlify.app`.

---

## 🛠 Netlify Configuration Architecture

### 1. Zero 404s on Page Refreshes (SPA Redirects)
Client-side routing with `react-router-dom` requires all subpaths (e.g., `/marketplace`, `/seed/1`, `/admin`, `/seller`, `/blockchain`) to return `index.html`.
This project includes two layers of redundancy:
- **`netlify.toml`**: Includes `[[redirects]] from = "/*" to = "/index.html" status = 200`.
- **`frontend/public/_redirects`**: Automatically copied to `dist/_redirects` during the build (`/*  /index.html  200`).

### 2. Standalone Live Demo Mode
When deployed to Netlify without a live backend server:
- The application automatically switches to **Interactive Demo Mode**.
- Features available with zero backend dependency:
  - Full Marketplace search, category filters, and trust-score sorting.
  - Interactive **Cryptographic Tamper Detection** (real client-side SHA-256 computation vs on-chain simulated hashes).
  - Escrow purchase simulations, order state transitions (Escrowed → Shipped → Delivered → Completed).
  - QR Code generator and verification tag scanner.
  - Seller and Admin dashboards with instant session feedback.
  - On-Chain Blockchain Explorer with block heights and transaction histories.

### 3. Connecting to a Live Backend API (Optional)
If you host the Node.js Express backend (e.g. on Render, Railway, Fly.io, or AWS):
1. In the Netlify dashboard, go to **Site configuration** → **Environment variables**.
2. Add a new variable:
   - **Key**: `VITE_API_BASE`
   - **Value**: `https://your-backend-api.onrender.com/api` (or your backend domain)
3. Trigger a redeploy. The frontend will immediately route all API calls to your live backend.

---

## 💻 Deploying via Netlify CLI (Alternative)

If you have the Netlify CLI installed:

```bash
# 1. Install Netlify CLI globally (if not installed)
npm install -g netlify-cli

# 2. Build the project locally
npm run build:netlify

# 3. Deploy to Netlify draft
netlify deploy --dir=frontend/dist

# 4. Deploy to production
netlify deploy --dir=frontend/dist --prod
```

---

## 🔒 Security & Performance Headers Included
The included `netlify.toml` automatically configures:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- 1-Year Immutable asset caching for bundled JavaScript and CSS.
