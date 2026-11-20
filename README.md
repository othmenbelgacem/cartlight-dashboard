# Cartlight

An e-commerce admin dashboard template built with React, TypeScript, Vite and Tailwind CSS 4.
Concept: a shop window at night. Three themes (light, dark, holiday), full right-to-left support, a command palette and a bento-grid layout.

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

## Keyboard

- `Ctrl` + `K` (`⌘` + `K` on Mac): open the command palette. Jump to a page, or change theme and direction.

## Project structure

- `src/theme/themes.css`: all colour tokens for the three themes. Change colours only here.
- `src/theme/useThemeSettings.ts`: theme, direction and snow settings, saved between visits.
- `src/components/ui/`: reusable components (Button, Card, DataTable, Modal, Tabs, Toast and more).
- `src/layout/`: app shell, sidebar and the navigation list.
- `src/pages/`: the pages.
- `src/data/`: sample products, customers and orders. Replace them with your own API.
- `src/lib/cx.ts`: small helper for joining class names.

## Accessibility

Text colours are tested for 4.5:1 contrast and form-field borders for 3:1 in all three themes (`npm run test`). Everything works with the keyboard, and animations stop for people who prefer reduced motion.

See `DEFINITION_OF_DONE.md` for the checklist every task must pass.
