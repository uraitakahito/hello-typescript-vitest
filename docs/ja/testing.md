[English](../en/testing.md) | 日本語

# テスト

## プロジェクト

`vitest.config.mts` は 3 つのプロジェクトを定めています。

| プロジェクト | ファイル | 動く場所 | コマンド |
|---|---|---|---|
| `unit` | `test/unit/**/*.test.ts` | Node | `npm test` |
| `browser` | `test/browser/**/*.test.ts` | 手元の Chromium（画面なし） | `npm test` |
| `vrt` | `test/vrt/**/*.vrt.test.ts` | 固定した Playwright のコンテナの中の Chromium | `npm run test:visual` |

`npm test` は、`unit` と `browser` を、監視せずに 1 回だけ実行します。`vrt` は Playwright サーバーが要るので、別のコマンドで実行します。[ビジュアルリグレッションテスト](visual-regression.md)を見てください。

## 単体テスト

単体テストは、Vitest の機能の小さな例です。

| ファイル | 示していること |
|---|---|
| `sum.test.ts` | `src/sum.ts` の素直なテスト |
| `mock.test.ts` | `vi.fn`、`mock.calls` と `mock.results`、`vi.spyOn` |
| `async.test.ts` | 成功する Promise と失敗する Promise のテスト。`.then`／`.catch`、`.resolves`／`.rejects`、`await`、`expect.assertions` を付けた `try`／`catch` |
| `concurrent.test.ts` | `it.concurrent` と、ふつうに順番に動くテストの比較、フックの順番。順番はログにだけ出て、`npm test` は `--silent` でログを隠すので、見るときはこのファイルだけを実行する |
| `domByDefineProperty.test.ts` | `Object.defineProperty` で `window.location` を差し替える |

1 つのファイルだけを実行するには、次のようにします。

```sh
npx vitest run test/unit/sum.test.ts
```

## ブラウザーのテスト

`test/browser/todo.test.ts` は、`vitest/browser` の `page` と `userEvent` で、[ToDo アプリ](todo-app.md)を Chromium の中で操作します。どのテストも、空にした `localStorage` でアプリを起動します。テスト全体で、追加、前後の空白、空白だけの名前と同じ名前、チェックの付け外し、削除とそのあとのフォーカスの移り先、同じ保存先でアプリを起動し直したときに残るタスクを確かめています。Browser Mode はページを読み込み直せないので、起動し直すことで再読み込みの代わりにしています。

## 型と lint

```sh
npm run typecheck   # tsc --noEmit。Vite と Vitest は型を検査しない
npm run lint        # ESLint のあと、ドキュメントの検査（npm run lint:docs）
```
