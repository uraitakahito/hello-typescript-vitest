English | [日本語](../ja/maintenance.md)

# Maintenance

## CI

| Workflow | Job | Runs on | Does |
|---|---|---|---|
| `test.yml` | Test | Pull requests to `main`, and pushes to `main` | `npm ci`, `npm run typecheck`, `npm run lint:docs`, installs the Chromium headless shell, `npm test` |
| `test.yml` | Visual | Pull requests to `main`, and pushes to `main` | Starts the Playwright server with Docker, runs `npm run test:visual`, and uploads `vrt-attachments` on failure |
| `reviewdog.yml` | ESLint | Pull requests to `main` | ESLint, reported as review comments |
| `safe-chain.yml` | Security Scan | Pull requests to `main` | `npm ci` through safe-chain (packages at least 48 hours old), then `npm audit --audit-level=moderate` |

## Dependency updates

Dependabot (`.github/dependabot.yml`) opens pull requests every Monday:

- GitHub Actions, all in one group.
- npm in three groups, matched in this order: `vitest` (vitest and `@vitest/*`, majors included), `playwright` (every update type), and `dev-dependencies` (everything else, minor and patch only).
- No pull requests for `@types/node` 25 or later, which would not match Node 24, or for `typescript` 6.1 or later (see Temporary settings).

When Dependabot bumps `playwright`, update `.playwright-image` in the same pull request; see [Visual regression tests](visual-regression.md).

## Temporary settings

Each of these has a FIXME where it is set. Undo it once its condition holds.

| Setting | Why | Undo when |
|---|---|---|
| `overrides.minimatch` in `package.json` | `eslint`, `@eslint/config-array` and `@typescript-eslint/typescript-estree` still ask for minimatch 10, which has advisory GHSA-g3hv-75wg-m249 | All three accept minimatch 11. Check each with `npm view <package> dependencies.minimatch`. |
| `typescript: ~6.0.3`, and the Dependabot ignore of `>=6.1.0` | typescript-eslint accepts TypeScript below 6.1 only | typescript-eslint accepts 6.1. Go back to `^` and remove the ignore. |
| `tinyexec` in `devDependencies` | Left over from an old version pin; nothing imports it | Any time |

## Comments in package.json

`package.json` keeps its comments in keys that start with `//`. The `"//"` key at the top explains the convention. `"//scripts"` explains every script, `"//devDependencies"` the dependencies that need a reason, and `"//overrides"` the override. Update a comment together with the entry it describes.
