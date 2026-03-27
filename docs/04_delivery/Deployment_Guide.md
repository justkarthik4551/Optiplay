# Deployment & Hosting Guide

> **Project:** OptiPlay — Gamified Operations Research Platform
> **Document:** Deployment & Hosting Guide
> **Cross-references:** [02 System Architecture](../03_engineering/02_System_Architecture.md) · [Build Walkthrough](./Build_Walkthrough.md)

---

## 1. Hosting Decision

### Platform: **Vercel** (Free Tier)

| Criteria | Details |
|----------|---------|
| **Why Vercel** | Zero-config for Vite/React, instant deploys, free `.vercel.app` subdomain, no credit card |
| **Free Tier Limits** | Unlimited sites, 100 GB bandwidth/month, 6,000 build minutes/month |
| **Alternatives Considered** | Netlify (similar), GitHub Pages (requires base path config), Cloudflare Pages (similar), Firebase Hosting (Google ecosystem) |
| **Decision** | Vercel chosen for simplicity — auto-detects Vite, one-click deploy from GitHub |

### Why This Works for OptiPlay
OptiPlay is a **pure client-side SPA** — no backend, no database, no server-side rendering. The build process (`npm run build`) outputs static HTML/CSS/JS files to `/dist`, which any CDN-based static hosting platform can serve directly.

---

## 2. Architecture Overview

```
GitHub Repo (source code)
    │
    ▼  (auto-trigger on push)
Vercel Build Pipeline
    │  npm install → npm run build → /dist
    ▼
Vercel CDN (global edge network)
    │
    ▼
User's browser loads SPA
    │  All logic runs client-side
    ▼
React Router handles navigation
```

---

## 3. Repository Structure

```
OR Problem/                     ← Git root
├── docs/                       ← Project documentation (14 files)
│   ├── README.md               ← Documentation index
│   ├── 01_strategy/
│   ├── 02_product/
│   ├── 03_engineering/
│   └── 04_delivery/
├── optiplay/                   ← Application source code (Vite project)
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
├── Session_1_game.pdf          ← Original OR problem from professor
└── README.md                   ← Project-level README for GitHub
```

---

## 4. Deployment Steps

### 4.1 Prerequisites
- GitHub account
- Code pushed to a GitHub repository

### 4.2 Initial Deployment
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **"Add New Project"** → Import your GitHub repo
3. Vercel auto-detects the Vite framework
4. Set **Root Directory** to `optiplay` (since the Vite project is in a subfolder)
5. Build settings (auto-detected):
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. Click **Deploy** → Live in ~30 seconds

### 4.3 Subsequent Deploys
- Every `git push` to `main` triggers an automatic redeploy
- Every pull request gets a unique **Preview URL** for testing

### 4.4 Custom Domain (Optional)
- In Vercel dashboard → Project Settings → Domains
- Add a custom domain (e.g., `optiplay.yourdomain.com`)
- Vercel provides free SSL via Let's Encrypt

---

## 5. Environment Notes

| Item | Value |
|------|-------|
| **Node.js version** | 18+ (Vercel default) |
| **Package manager** | npm |
| **Build command** | `npm run build` |
| **Output directory** | `dist` |
| **Root directory** | `optiplay` |
| **SPA routing** | Vercel auto-handles client-side routing for Vite SPAs |

---

## 6. Cost Breakdown

| Resource | Free Tier Limit | Our Usage |
|----------|----------------|-----------|
| Bandwidth | 100 GB/month | ~1 MB per user visit × minimal traffic = negligible |
| Build minutes | 6,000/month | ~30 seconds per deploy = negligible |
| Sites | Unlimited | 1 |
| SSL | Free (auto-provisioned) | ✅ |
| **Total monthly cost** | | **$0** |
