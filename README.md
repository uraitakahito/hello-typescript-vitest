## Setup

Please download the required files by following these steps:

```
curl -L -O https://raw.githubusercontent.com/uraitakahito/hello-javascript/refs/tags/1.2.1/Dockerfile.dev
curl -L -O https://raw.githubusercontent.com/uraitakahito/hello-javascript/refs/tags/1.2.1/docker-entrypoint.sh
chmod 755 docker-entrypoint.sh
```

Detailed environment setup instructions are described at the beginning of the `Dockerfile`.

```console
% vitest run test/unit/sum.test.ts
```

## ToDo app

`src/todo.ts` is a small ToDo app. The browser tests and the visual regression tests run against it.

- Type a title and press 追加 (or Enter) to add a task to the end of the list. Spaces around the title are removed, a title of only spaces is ignored, and the same title can be added more than once.
- Check a task to mark it done, and uncheck it to make it open again. The line under the list counts the open tasks (`残り N 件`).
- Tasks are saved in `localStorage` under the key `todos`, so they survive a reload. Tasks cannot be deleted, renamed or reordered.

Run these commands on the Mac host. The container described in `Dockerfile.dev` publishes no ports, so a browser on the Mac cannot reach a server started inside it.

```console
% npm run dev      # serve the app at http://localhost:5173/
% npm run build    # write the app to dist/
% npm run preview  # serve dist/ at http://localhost:4173/
```

Open `http://localhost:5173/`. The dev server listens on `localhost`, which is `::1` on macOS, so `http://127.0.0.1:5173/` does not connect. The dev server and the preview show different tasks, because each port has its own `localStorage`.

`npm test` runs the unit tests and the browser tests in `test/browser/todo.test.ts`. `npm run test:visual` checks how the app looks.

## Visual regression tests

Screenshots are taken by a Playwright server that runs in the pinned image written in `.playwright-image`, so every machine and CI produce the same pixels. Run these commands on the Mac host, where Apple Container is available.

```console
% npm run vrt:server          # start the Playwright server
% npm run test:visual         # compare with the reference screenshots
% npm run test:visual:update  # accept an intended UI change
% npm run vrt:server:stop
```

When a comparison fails, the actual screenshot is written to `.vitest/attachments/`.

To upgrade Playwright, update `playwright` in `package.json` and the tag and digest in `.playwright-image` in the same commit. `npm run vrt:server` refuses to start while they differ.
