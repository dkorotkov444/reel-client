# REEL — React Frontend (reel-client)

Small single-page React application used as the frontend for the REEL movie app.

## Quick summary
- Entry HTML: `src/index.html` — contains `<div id="root"></div>` and loads `src/index.jsx` as an ES module.
- Entry module: `src/index.jsx` — root React component `ReelApplication`, uses `createRoot`.
- Styling: `src/index.scss` is imported from the app entry (`import "./index.scss"`). The repo exposes a global SCSS variable (`$color`).
- Dependencies: `react`, `react-dom`. Dev helper: `@parcel/transformer-sass` is present in `devDependencies`.
- There are currently no `start`/`build` scripts in `package.json`.

## Prerequisites
- Node.js (LTS recommended)
- npm

## Install
1. Install project dependencies:
   ```
   npm install
   ```

## Run (recommended minimal approach)
This project expects Parcel v2 as the bundler (inferred from `@parcel/transformer-sass`). Because there are no scripts, run via npx:
```
npx parcel src/index.html
```
Open the address printed by Parcel (typically http://localhost:1234).

## Build for production
```
npx parcel build src/index.html
```

## Suggested npm scripts (optional)
Add these to `package.json` if you want shortcuts:
```json
"scripts": {
  "start": "parcel src/index.html",
  "build": "parcel build src/index.html",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```
If you add these scripts, also add `parcel` as a devDependency and run `npm install`. Include a short justification for added dependencies in PRs.

## Project structure & conventions
- Keep a single HTML entry and the `#root` mount. Do not convert to multi-entry without maintainer approval.
- Use ES modules (`type="module"`) in `src/index.html`.
- Place React components under `src/` and use `.jsx` for files. Prefer small stateless functional components (see `src/index.jsx` for pattern).
- Import global styles from `src/index.scss` in the entrypoint. Component-level SCSS may be imported from individual component files when needed.
- Use React 18+ root API: `createRoot(container).render(<ReelApplication />)`.

## Files to reference
- `src/index.html`
- `src/index.jsx`
- `src/index.scss`
- `package.json`
- `.github/copilot-instructions.md` (AI agent guidance)

## What is NOT in this repo (avoid assumptions)
- No API client, environment files, or secret management detected. Do not add code that depends on backend URLs or secret keys without maintainer guidance.
- No tests, linters, or CI config. If adding them, update `package.json` and document the rationale in the PR.

## Troubleshooting
- If SCSS compilation fails: run via `npx parcel` (ensure Parcel v2) or install `parcel` locally alongside `@parcel/transformer-sass`.
- For missing module errors, confirm `node_modules` exists and `npm install` completed successfully.

## Contributing
- Keep changes small and easy to review.
- If you add dependencies (e.g., `parcel`), include a short justification and how to run the app in the PR description.
- Preserve `src/index.html` and the `#root` mount when refactoring.
- For UI changes include a screenshot or short demo steps in the PR.

## License & metadata
See `package.json` for author, license, and repository links.

## Poster images (TMDb)

- This project uses poster images sourced from The Movie Database (TMDb). Poster URLs have been saved into `tools/movies.js` so the front-end can use direct image links (no runtime scraping).
- The script used to fetch posters is `tools/fetch_tmdb_posters.js`. It queries the TMDb API once per movie title/year and writes results to `tools/movies-with-posters.json` (and `tools/movies-with-posters.js` with a TMDb attribution header).

How to regenerate posters (local only)

1. Obtain a TMDb API key (requires a free account): https://www.themoviedb.org/settings/api
2. Set the key in your PowerShell session and run the script from the repo root:

```powershell
$env:TMDB_API_KEY = "your_tmdb_api_key_here"
node .\tools\fetch_tmdb_posters.js
```

3. This writes `tools/movies-with-posters.json` and `tools/movies-with-posters.js` (the latter contains an attribution comment). If you prefer, you can copy the poster URLs into `tools/movies.js`.

Attribution

- Per TMDb terms, include visible attribution in your UI where TMDb content is shown. A minimal attribution line is present in the app footer: "Poster images provided by TMDb" linking to https://www.themoviedb.org/.

Security

- Do not commit your TMDb API key. Use environment variables (as shown) or a local `.env` file excluded via `.gitignore` if you need persistence for development.

## Session handling

This project follows a conservative session policy for user profile updates:

- Non-sensitive updates (email, birth date): the backend updates the database and returns the updated user object. The frontend updates the stored `user` in localStorage and keeps the current JWT token; the user remains logged in.

- Sensitive updates (username, password): the backend revokes the current JWT for security. The frontend forces a logout (clears `localStorage` and in-memory state) and redirects the user to the login page. The profile UI displays a brief alert explaining the reason for logout.

Why this approach?
- Username changes affect session identity and many client-side paths; forcing re-login avoids subtle inconsistencies.
- Password changes are security-critical; forcing re-authentication prevents session fixation or retained access from other tokens.

How to test locally
1. Start backend and frontend.
2. Log in as a user and open the profile page.
3. Update email or birth date — you should see a success alert and remain logged in.
4. Update username or password — you should see an alert, be logged out, and land on the login page.

If you later change the backend to return a new JWT for certain profile updates, update `src/components/main-view/main-view.jsx`'s `onUserUpdate` handler to accept and store the returned token.

```
