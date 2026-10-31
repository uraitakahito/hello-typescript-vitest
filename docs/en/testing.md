English | [日本語](../ja/testing.md)

# Testing

## Projects

`vitest.config.mts` defines three projects.

| Project | Files | Runs in | Command |
|---|---|---|---|
| `unit` | `test/unit/**/*.test.ts` | Node | `npm test` |
| `browser` | `test/browser/**/*.test.ts` | Chromium on your machine, headless | `npm test` |
| `vrt` | `test/vrt/**/*.vrt.test.ts` | Chromium in the pinned Playwright container | `npm run test:visual` |

`npm test` runs `unit` and `browser` once, without watching. `vrt` needs the Playwright server, so it has its own commands; see [Visual regression tests](visual-regression.md).

## Unit tests

The unit tests are small examples of Vitest features.

| File | Shows |
|---|---|
| `sum.test.ts` | a plain test of `src/sum.ts` |
| `mock.test.ts` | `vi.fn`, `mock.calls` and `mock.results`, and `vi.spyOn` |
| `async.test.ts` | testing a resolved and a rejected promise with `.then`/`.catch`, `.resolves`/`.rejects`, `await`, and `try`/`catch` with `expect.assertions` |
| `concurrent.test.ts` | `it.concurrent` next to plain sequential tests, and the order of the hooks. The order shows only in the log, which `npm test` hides with `--silent`; run the file alone to see it. |
| `domByDefineProperty.test.ts` | replacing `window.location` with `Object.defineProperty` |

To run one file:

```sh
npx vitest run test/unit/sum.test.ts
```

## Browser tests

`test/browser/todo.test.ts` drives the [ToDo app](todo-app.md) in Chromium with `page` and `userEvent` from `vitest/browser`. Each test mounts the app on a cleared `localStorage`. Together the tests cover adding a task, trimming, blank and duplicate titles, checking and unchecking, and keeping tasks when the app is mounted again on the same storage. Browser Mode cannot reload the page, so mounting again stands in for a reload.

## Types and lint

```sh
npm run typecheck   # tsc --noEmit; Vite and Vitest do not check types
npm run lint        # ESLint, then the docs check (npm run lint:docs)
```
