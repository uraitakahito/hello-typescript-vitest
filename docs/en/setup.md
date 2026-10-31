English | [日本語](../ja/setup.md)

# Setup

## Requirements

- Node 24. CI uses Node 24 as well.
- npm. `.npmrc` keeps npm from installing versions published less than two days ago.
- A container runtime for the visual regression tests, which run their browser in a container: [Apple Container](https://github.com/apple/container) on a Mac with Apple silicon by default, or Docker with `CONTAINER_RUNTIME=docker`, as in CI. The other tests need only Node and the Chromium installed below.

## Install

```sh
npm ci
npx playwright install chromium   # the browser for the browser tests
```

The visual regression tests do not use this browser; see [Visual regression tests](visual-regression.md).

## Development container

You can also work inside a container built from `Dockerfile.dev`. Download it and its entry point script:

```sh
curl -L -O https://raw.githubusercontent.com/uraitakahito/hello-javascript/refs/tags/1.2.1/Dockerfile.dev
curl -L -O https://raw.githubusercontent.com/uraitakahito/hello-javascript/refs/tags/1.2.1/docker-entrypoint.sh
chmod 755 docker-entrypoint.sh
```

The steps to build and start the container are at the top of `Dockerfile.dev`. Git ignores both files.

The container publishes no ports, so a browser outside it cannot reach a server started inside it. It cannot start the Playwright server either, because that server runs in a container of its own. Run `npm run dev` and the visual regression tests on the host.
