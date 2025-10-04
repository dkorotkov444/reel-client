# Copilot / AI agent quick instructions for reel-client

This document captures the minimal, concrete knowledge an AI coding agent needs to be productive in this repository.

## Quick summary
- Single-page React front-end. Entry HTML: `src/index.html`. Entry module: `src/index.jsx`.
- Styling uses SCSS: `src/index.scss` is imported from `index.jsx` (see `import "./index.scss"`).
- package.json lists `react`, `react-dom` and a Parcel Sass transformer (`@parcel/transformer-sass`) but there are no build/dev scripts present.

## What to edit and where (common tasks)
- Add UI components under `src/`. Use `.jsx` for components. Example pattern: create `src/components/MyComponent.jsx` and import into `src/index.jsx`.
- Import component-level SCSS from the component file or central `src/index.scss`. The project currently uses a global SCSS variable: `$color` in `src/index.scss`.
- Keep the top-level DOM mount as-is: `document.querySelector("#root")` and using `createRoot` from `react-dom/client`.

## File examples to reference
- `src/index.html` – contains `<div id="root"></div>` and loads `index.jsx` as a module.
- `src/index.jsx` – minimal root component `ReelApplication` and React render call:
  - Uses `createRoot(container).render(<ReelApplication />)` (React 18+ API).
  - Imports `./index.scss` to include styles in the bundle.

## Build / run notes (discoverable facts + safe assumptions)
- Facts: `package.json` only contains a `test` script. Dependencies: `react`, `react-dom`. DevDependency: `@parcel/transformer-sass`.
- Interpretation: the presence of the Parcel Sass transformer strongly suggests Parcel was intended as the bundler. There are currently no scripts, so do not assume a working dev server until the maintainer adds scripts.
- How an agent should proceed when asked to run or add a dev server:
  1. Prefer to ask the maintainer before adding dependencies. If asked to add a dev script, add a `start` and `build` script that uses Parcel v2, e.g.:
     - `start`: `parcel src/index.html`
     - `build`: `parcel build src/index.html`
  2. If you add scripts, also add `parcel` as a devDependency and run `npm install` (notify the human in the PR description).

## Conventions & patterns (concrete, codebase-specific)
- Use ES module `type=module` entry in `src/index.html` (do not convert to legacy script loading).
- Top-level styles are kept in `src/index.scss` and imported from `index.jsx`. Small projects: importing the root stylesheet from the app entry is expected.
- Prefer functional components and the React 18+ root API (`createRoot`). When adding components, mirror the small, explicit style used in `index.jsx` (stateless functional components).

## What is NOT in the repo (so avoid assumptions)
- No API client, services, or environment/key files detected. Do not add code that depends on backend URLs or secret keys without clarifying where to store them.
- No tests, linters, or CI config present. If adding them, include changes to `package.json` and explain them in the PR.

## Guidance for PRs and edits from an AI agent
- Keep changes limited and easy to review. If you add new dependencies (e.g., `parcel`), include a short justification in the PR description and run `npm install` locally.
- For UI changes, include a screenshot or a small runnable demo instruction (how to start the app) in the PR description.
- When refactoring, preserve the `#root` mount and the single `index.html` entry.

## Quick checklist for the agent before committing
- Did I update `package.json` only when necessary? (Yes/No)
- Did I preserve `src/index.html` and the `#root` mount? (Yes/No)
- Did I keep styling imports (`import "./index.scss"`) or intentionally move them and explain why? (Yes/No)

If anything in this file is unclear or you want the agent to follow additional conventions (testing, CI, strict typing, specific bundler/version), tell the agent which conventions to apply and it will update this file and the codebase accordingly.

-- End of instructions
