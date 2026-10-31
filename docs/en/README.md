English | [日本語](../ja/README.md)

# Documentation

hello-typescript-vitest is a sample project for testing TypeScript with Vitest. Start with Setup, then read the page for the tests you want to run.

## Pages

- [Setup](setup.md) — Node, dependencies, the browser for the browser tests, and the development container
- [ToDo app](todo-app.md) — the app that the browser and visual regression tests exercise: what it does and how to open it
- [Visual regression tests](visual-regression.md) — the pinned Playwright server, running the tests, and reviewing the results

## Writing these docs

Every page exists in English (`docs/en/`) and Japanese (`docs/ja/`) under the same file name, and its first line links to the other language. Change both languages in the same pull request. `npm run lint:docs` fails when a page has no pair, when its first line is not that link, when a pair differs in the order of its heading levels or code-block languages, or when a relative link is broken. It does not compare the prose.
