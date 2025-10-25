# REEL — React Frontend (reel-client)

Very short summary: A small single-page React app that serves as the frontend for the REEL movie demo — browse movies, view details, favorite items, and search the catalog.

## Table of Contents
- Quick Start
- Project Overview / Technical Summary
- Features & UX
- Data & API
- Session & Auth policy
- Developer details / Project structure
- Styling / Assets
- Tests / Linting / CI
- Troubleshooting
- License & metadata

## Quick Start

1. Install dependencies:

```powershell
npm install
```

2. Start the dev server (Parcel v2 is used in this project):

```powershell
npm run start
# or, if you prefer npx directly:
npx parcel src/index.html
```

Notes:
- The `start` and `build` scripts are defined in `package.json` and invoke Parcel. If you add or change scripts, document them in PRs.

## Project Overview / Technical Summary

- Tech stack: React (v18+), React Router (v6), React-Bootstrap, Parcel v2, Bootstrap 5.
- Single-page app. Entry files:
  - `src/index.html` — HTML entry mount (`#root`).
  - `src/index.jsx` — React app bootstrap (uses React 18 createRoot API).
- High-level data flow:
  - `MainView` (root app view) fetches the movie list from the API and holds the central session/user state.
  - Movie cards are rendered on the main view; selecting a movie opens `MovieView` (details + similar carousel).
  - Favorite toggles and profile updates are handled through APIs and update the central user state.

## Features & UX

- Main features:
  - Browse paginated movie cards on the main view.
  - Movie detail view with poster and metadata.
  - "Similar movies" carousel (genre-based similarity).
  - Favorite/unfavorite movies (saved to user profile).
  - Simple client-side search on the main view.

- UX details:
  - Search (Main view):
    - Centered search field on the main page.
    - Search only applies when the query is at least 5 characters long; otherwise the full list and original pagination are shown.
    - Case-insensitive substring match against: `title`, `starring` (joined), `director.name`, and `genre.name`.
    - Filtering is client-side and resets pagination to page 1 on new queries.

  - Movie view:
    - Split layout: left column shows details (title, director, genre, description, release year, IMDb rating, starring list), right column shows the poster.
    - Director and Genre names show accessible tooltips with the director biography and genre description respectively (keyboard-focusable and aria-friendly).
    - Starring list rendered as a comma-and-space separated line (e.g., "Actor A, Actor B").

  - Similar movies:
    - Deterministic rule: movies whose `genre.name` matches the current movie's `genre.name` (case-insensitive) are considered similar and shown in the lower carousel.

  - Favorites:
    - Favorite toggles are available on cards and the MovieView (heart icon). Toggling calls the user favorites API and updates stored user in localStorage.

  - Back navigation:
    - Links to MovieView pass `state.from` (origin) so the Back control can navigate to the originating list. A Back link is present in the navbar and prefers history-first navigation when appropriate (falls back to `state.from || '/'`).

  - Accessibility notes:
    - Tooltips are keyboard-focusable (`tabIndex=0`, `role="button"`) and rendered with React-Bootstrap's OverlayTrigger/Tooltip.
    - Favorite buttons use `aria-pressed` and descriptive `aria-label`s.

## Data & API

- Endpoints used by the frontend (examples used in code):
  - GET /movies — fetch movies list (example in code: `https://reel-movie-api-608b8b4b3a04.herokuapp.com/movies`).
  - Favorites toggle: `/users/:username/:movieId` (PATCH to add, DELETE to remove) — the exact base URL is the same API host as movies.

- Movie object shape (fields the UI expects):
  - `_id` (string)
  - `title` (string)
  - `description` (string)
  - `release_year` (string|number)
  - `image_url` (string)
  - `rating_imdb` (string|number)
  - `featured` (bool)
  - `starring` (array of strings)
  - `director`: { name, bio, birth_date, death_date }
  - `genre`: { name, description }

- Poster images & TMDb
  - Poster URLs are managed by scripts in `tools/` (see `tools/fetch_tmdb_posters.js`) and poster URLs are stored in `tools/movies.js` (or `tools/movies-with-posters.json`).

## Session & Auth policy

- Session state lives in `localStorage` (user object and token) and is mirrored in-memory in `MainView`.
- Policy:
  - Non-sensitive profile updates (email, birth date) update the stored user and preserve the session/token.
  - Sensitive updates (username, password) revoke the current JWT on the server; the frontend forces logout (clears localStorage and in-memory user/token) and redirects to login.
- Token handling hint: the app sends `Authorization: Bearer <token>` headers on API calls and handles 401/403 responses by clearing session and prompting re-login.

## Developer details / Project structure

- Key files to inspect:
  - `src/index.html`, `src/index.jsx`, `src/index.scss`
  - `src/components/main-view/main-view.jsx` — app root, fetches movies, holds session state, contains search and main card grid.
  - `src/components/movie-view/movie-view.jsx` — movie details and similar-movies carousel.
  - `src/components/movie-card/movie-card.jsx` — small card used in lists and carousels.
  - `src/components/navigation-bar/navigation-bar.jsx` — top navigation and Back link.
  - `src/components/profile-view/profile-view.jsx` — profile editing and favorites carousel.

- Conventions:
  - Add components under `src/` using `.jsx`.
  - Import global styles from `src/index.scss` in `src/index.jsx`.
  - Pass `navState` (`{ from: ... }`) when linking to MovieView so Back navigation is deterministic.
  - Use functional components and React hooks.

## Styling / Assets

- Styling: SCSS is used for project styles. Root stylesheet: `src/index.scss` (imported from `index.jsx`).
- Bootstrap: project uses Bootstrap 5 and `react-bootstrap` components for layout and interactive controls.

## Tests / Linting / CI

- Current state: no automated tests, linter, or CI configuration present.
- Recommendations:
  - Add basic unit tests for pure logic (search filtering) and a small integration/smoke test for critical flows.
  - Consider adding ESLint + Prettier for consistent formatting.

## Troubleshooting

- Parcel HMR module error ("Cannot find module '...'" in dev console):
  - Hard refresh the browser (Ctrl+F5).
  - If it persists, stop the dev server and clear Parcel cache then restart (PowerShell):

```powershell
Remove-Item -Recurse -Force .parcel-cache
Remove-Item -Recurse -Force dist
npm run start
```

- 401 Unauthorized + JSON parse error (Unexpected token 'U' when parsing "Unauthorized"):
  - The API returned plain-text error. The client now checks response.status before calling `response.json()` and handles 401/403 by clearing session and alerting the user. If you see this error, verify token validity and inspect the API response.

- To disable HMR if it causes instability with Parcel during development:

```powershell
npm run start -- --no-hmr
```

- Fullscreen/Editor tips (if you entered fullscreen accidentally):
  - VS Code: press F11 to toggle Full Screen; Ctrl+K then Z toggles Zen Mode; Esc Esc to exit Zen Mode.
  - Browser: F11 toggles browser full screen.

- Where to look for runtime errors:
  - Browser developer console (Console & Network tabs).
  - Terminal running `npm run start` (Parcel output and HMR logs).

## License & metadata

- See `package.json` for author and license information.
