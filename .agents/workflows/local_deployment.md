---
description: How to start the OptiPlay local development server
---

# Local Deployment Workflow

Follow these steps to deploy the OptiPlay application locally for development and testing. The application is a Vite-based React frontend.

## Steps

// turbo
1. Start the local development server by running the standard npm script within the `optiplay` directory:
```bash
cd optiplay
npm run dev
```

2. Wait for the server to start (it typically takes a few seconds). You should see output indicating that Vite is ready and listening on `http://localhost:5173/`. 
If you want to view it, use the `open_browser_url` or `browser_subagent` tools to navigate to `http://localhost:5173/`.
