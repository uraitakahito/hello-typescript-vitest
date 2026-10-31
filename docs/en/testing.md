English | [日本語](../ja/testing.md)

# Testing

## Projects

`vitest.config.mts` defines three projects.

| Project | Files | Runs in | Needs |
|---|---|---|---|
| `unit` | `test/unit/**/*.test.ts` | Node | Nothing |
| `browser` | `test/browser/**/*.test.ts` | Chromium on your machine, headless | `npx playwright install chromium`, once; see [Setup](setup.md) |
| `vrt` | `test/vrt/**/*.vrt.test.ts` | Chromium in the pinned Playwright container | A running Playwright server (`npm run vrt:server`); see [Visual regression tests](visual-regression.md) |

## Run the tests

```sh
npm test                           # unit and browser, once
npx vitest run --project unit      # unit only
npx vitest run --project browser   # browser only
npm run vrt:server                 # vrt: start the Playwright server,
npm run test:visual                # then compare with the reference screenshots
```

- `npm test` hides what the tests print (`--silent=true`). The `npx vitest run` commands show it.
- Always name a project or a file. A plain `npx vitest run`, or one with only `-t`, runs `vrt` as well, which fails at once with `connect ECONNREFUSED 127.0.0.1:6677` while the Playwright server is stopped.
- To stop the server or update the reference screenshots, see [Visual regression tests](visual-regression.md).

## Run one file or one test

Add a file or a name after `npm test --`. Only `unit` and `browser` are searched, so the Playwright server is not needed.

```sh
npm test -- test/unit/sum.test.ts           # one file
npm test -- test/browser/todo.test.ts
npm test -- -t '削除すると一覧から消える'   # only the tests whose name matches
```

`-t` takes a regular expression, and the tests that do not match are skipped. To see what the tests print as well, name the project and use `npx vitest run`:

```sh
npx vitest run --project browser -t '削除すると一覧から消える'
```

## Re-run on every change

```sh
npx vitest --project unit --project browser
```

Without `run`, Vitest keeps running and runs the affected tests again each time you save a file. Press `h` for help and `q` to quit.

## Watch the browser

The `browser` project runs Chromium without a window (`headless: true` in `vitest.config.mts`). To watch the tests drive the app, turn that off:

```sh
npx vitest run --project browser --browser.headless=false   # the window closes when the tests finish
npx vitest --project browser --browser.headless=false       # the window stays open; press q to quit
```

The window is the Chromium that Playwright installed, and it shows up as "Google Chrome for Testing". The tests finish in a couple of seconds, so use the second command to look at the page after the run. Run these on your Mac; CI installs only the Chromium that has no window.

## Unit tests

The unit tests are small examples of Vitest features.

| File | Shows |
|---|---|
| `sum.test.ts` | a plain test of `src/sum.ts` |
| `mock.test.ts` | `vi.fn`, `mock.calls` and `mock.results`, and `vi.spyOn` |
| `async.test.ts` | testing a resolved and a rejected promise with `.then`/`.catch`, `.resolves`/`.rejects`, `await`, and `try`/`catch` with `expect.assertions` |
| `concurrent.test.ts` | `it.concurrent` next to plain sequential tests, and the order of the hooks. The order shows only in the log, so run it with `npx vitest run test/unit/concurrent.test.ts`. |
| `domByDefineProperty.test.ts` | replacing `window.location` with `Object.defineProperty` |

## Browser tests

`test/browser/todo.test.ts` drives the [ToDo app](todo-app.md) in Chromium with `page` and `userEvent` from `vitest/browser`. Each test mounts the app on a cleared `localStorage`. Together the tests cover adding a task, trimming, blank and duplicate titles, checking and unchecking, deleting a task and where the focus goes afterwards, and what is left when the app is mounted again on the same storage. Browser Mode cannot reload the page, so mounting again stands in for a reload.

## Types and lint

```sh
npm run typecheck   # tsc --noEmit; Vite and Vitest do not check types
npm run lint        # ESLint, then the docs check (npm run lint:docs)
```
