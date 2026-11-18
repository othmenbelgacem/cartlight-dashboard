# Cartlight

An AI e-commerce admin dashboard template built with React, TypeScript, Vite and Tailwind CSS 4.
Concept: a shop window at night. Three themes (light, dark, holiday) and full right-to-left support.

## Requirements

Node.js 22.12 or newer (use the current LTS from nodejs.org).

## Commands

| Command            | What it does                            |
| ------------------ | --------------------------------------- |
| `npm install`      | Installs the packages                   |
| `npm run dev`      | Starts the app at http://localhost:5173 |
| `npm run build`    | Type-checks and builds to `dist/`       |
| `npm run lint`     | Checks code quality                     |
| `npm run test`     | Runs the tests                          |
| `npm run format`   | Formats the code                        |
| `npm run licenses` | Rebuilds `LICENSES.md`                  |

## Project structure

- `src/theme/themes.css`: all colour tokens for the three themes. Change colours only here.
- `src/theme/useThemeSettings.ts`: theme and direction state.
- `src/App.tsx`: the Sprint 0 foundation page.

See `DEFINITION_OF_DONE.md` for the checklist every task must pass.
