# Registration Website

React + TypeScript + Vite frontend for a registration website. The production site is intended to run on Netlify, send registration form data to Google Sheets through a Google Apps Script Web App, and use Google Analytics 4 for traffic and conversion tracking.

The frontend integration (sign-up form, Apps Script submission, GA4) is not implemented yet — this repo is a clean starting point for the developers who pick it up.

## Project Structure

```text
2026-mch-signup/
  frontend/
    index.html
    package.json
    src/
      App.tsx
      main.tsx
      index.css
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

`npm install` also runs the `prepare` script, which installs the Husky git hooks.

Before pushing changes, run:

```bash
cd frontend
npm run format:check
npm run lint
npm run build
```

## Environment Variables

Create `frontend/.env` for local testing (copy from `frontend/.env.example`):

```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Add the same values in Netlify under `Site configuration` -> `Environment variables`:

| Variable | Purpose |
| --- | --- |
| `VITE_APPS_SCRIPT_URL` | The deployed Google Apps Script Web App URL that receives registration submissions. |
| `VITE_GA_MEASUREMENT_ID` | The Google Analytics 4 measurement ID used for traffic and conversion tracking. |

## Netlify Deployment

This repo already includes `netlify.toml` with the frontend build settings:

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to   = "/index.html"
  status = 200
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

Registration submissions are sent to a Google Apps Script Web App, which appends each submission as a new row in a linked Google Sheet. Deploy the Apps Script as a Web App (`Execute as: Me`, `Who has access: Anyone`) and put the resulting `/exec` URL in `VITE_APPS_SCRIPT_URL`. The frontend code that posts to this endpoint will be implemented as part of the registration form.