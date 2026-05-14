# Registration Website

React + TypeScript + Vite frontend for a registration website. The production site is intended to run on Netlify, send registration form data to Google Sheets through a Google Apps Script Web App, and use Google Analytics 4 for traffic and conversion tracking.

## Project Structure

```text
Registration_template/
  frontend/
    index.html
    package.json
    src/
      App.tsx
      main.tsx
      vite-env.d.ts
  netlify.toml
  README.md
```

## Local Development

```bash
cd frontend
npm install
npm run dev
```

Before pushing changes, run:

```bash
cd frontend
npm run format:check
npm run lint
npm run build
```

## Environment Variables

Create `frontend/.env` for local testing:

```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Add the same values in Netlify under `Site configuration` -> `Environment variables`:

| Variable | Purpose |
| --- | --- |
| `VITE_APPS_SCRIPT_URL` | The deployed Google Apps Script Web App URL that receives registration submissions. |

## Netlify Deployment

This repo already includes `netlify.toml` with the frontend build settings:

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "dist"
```

Steps:

1. Push this repository to GitHub.
2. In Netlify, choose `Add new site` -> `Import an existing project`.
3. Connect the GitHub repository.
4. Confirm the build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
5. Add `VITE_APPS_SCRIPT_URL` and `VITE_GA_MEASUREMENT_ID` in Netlify environment variables.
6. Deploy the site.
7. In Netlify, open `Domain management` and attach your specific URL/custom domain.
8. Update the DNS records at your domain provider using the values Netlify gives you.
9. After DNS is active, make sure the custom domain is the primary production domain and HTTPS is enabled.

The redirect rule in `netlify.toml` sends all routes to `index.html`, which is useful if the registration page later uses client-side routing.

## Google Apps Script to Google Sheets
