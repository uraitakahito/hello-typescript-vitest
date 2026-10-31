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
