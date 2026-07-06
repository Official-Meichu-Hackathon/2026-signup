# Frontend

React + TypeScript + Vite app for the registration website. See the [root README](../README.md) for project setup, environment variables, Netlify deployment, and the Google Apps Script / Google Analytics integration.

## Scripts

Run from this directory (`frontend/`):

```bash
npm install            # install dependencies (also sets up Husky git hooks via prepare)
npm run dev            # start the Vite dev server
npm run build          # type-check and build for production
npm run preview        # preview the production build
npm run lint           # run ESLint (--max-warnings 0)
npm run format          # format the codebase with Prettier
npm run format:check   # check formatting without writing
```

Pre-commit hooks (Husky + lint-staged) automatically format and lint staged files on commit.
