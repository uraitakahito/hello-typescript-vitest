[English](../en/maintenance.md) | 日本語

# 保守

## CI

| ワークフロー | ジョブ | 動くとき | すること |
|---|---|---|---|
| `test.yml` | Test | `main` への PR と push | `npm ci`、`npm run typecheck`、`npm run lint:docs`、Chromium の headless shell のインストール、`npm test` |
| `test.yml` | Visual | `main` への PR と push | Docker で Playwright サーバーを起動し、`npm run test:visual` を実行する。失敗したら `vrt-attachments` をアップロードする |
| `reviewdog.yml` | ESLint | `main` への PR | ESLint を実行し、結果をレビューのコメントにする |
| `safe-chain.yml` | Security Scan | `main` への PR | safe-chain 経由の `npm ci`（公開から 48 時間以上たった版だけ）のあと、`npm audit --audit-level=moderate` |

## 依存の更新

Dependabot（`.github/dependabot.yml`）が、毎週月曜日に PR を作ります。

- GitHub Actions は、すべて 1 つのグループにまとめます。
- npm は 3 つのグループに分け、この順に当てはめます。`vitest`（vitest と `@vitest/*`、メジャーも含む）、`playwright`（すべての更新）、`dev-dependencies`（それ以外。マイナーとパッチだけ）。
- `@types/node` の 25 以降（Node 24 に合わないため）と、`typescript` の 6.1 以降（「一時的な設定」を参照）は、PR を作りません。

Dependabot が `playwright` を上げたときは、同じ PR で `.playwright-image` も直してください。[ビジュアルリグレッションテスト](visual-regression.md)を見てください。

## 一時的な設定

次の設定には、設定した場所に FIXME があります。条件を満たしたら、元に戻してください。

| 設定 | 理由 | 戻せるとき |
|---|---|---|
| `package.json` の `overrides.minimatch` | `eslint`、`@eslint/config-array`、`@typescript-eslint/typescript-estree` がまだ minimatch 10 系を求めていて、その版には脆弱性 GHSA-g3hv-75wg-m249 がある | 3 つとも minimatch 11 系を受け付けたとき。それぞれ `npm view <パッケージ> dependencies.minimatch` で確かめる |
| `typescript: ~6.0.3` と、Dependabot の `>=6.1.0` の除外 | typescript-eslint が 6.1 より前の TypeScript しか受け付けない | typescript-eslint が 6.1 に対応したとき。`^` に戻し、除外も外す |
| `devDependencies` の `tinyexec` | 以前の版の固定の名残で、どこからも使っていない | いつでも |

## package.json のコメント

`package.json` は、`//` で始まるキーにコメントを書いています。先頭の `"//"` が、この書き方を説明しています。`"//scripts"` はすべてのスクリプトを、`"//devDependencies"` は理由のある依存を、`"//overrides"` は overrides を説明します。項目を変えるときは、その説明も一緒に直してください。
