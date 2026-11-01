[English](../en/testing.md) | 日本語

# テスト

## プロジェクト

`vitest.config.mts` は 3 つのプロジェクトを定めています。

| プロジェクト | ファイル | 動く場所 | 先に要るもの |
|---|---|---|---|
| `unit` | `test/unit/**/*.test.ts` | Node | なし |
| `browser` | `test/browser/**/*.test.ts` | 手元の Chromium（画面なし） | 一度だけ `npx playwright install chromium`。[準備](setup.md)を参照 |
| `vrt` | `test/vrt/**/*.vrt.test.ts` | 固定した Playwright のコンテナの中の Chromium | 動いている Playwright サーバー（`npm run vrt:server`）。[ビジュアルリグレッションテスト](visual-regression.md)を参照 |

## テストを実行する

```sh
npm test               # unit と browser を 1 回実行する
npm run test:unit      # unit だけ
npm run test:browser   # browser だけ
npm run vrt:server     # vrt: Playwright サーバーを起動してから、
npm run test:visual    # 基準画像と比べる
```

- `npm test` は、テストが出力するログを隠します（`--silent=true`）。`npm run test:unit` と `npm run test:browser` では表示されます。
- プロジェクトかファイルを必ず指定してください。何も指定しない `npx vitest run` や、`-t` だけを付けたものは `vrt` も実行し、Playwright サーバーが止まっていると `connect ECONNREFUSED 127.0.0.1:6677` ですぐに失敗します。
- サーバーの止め方と基準画像の撮り直し方は、[ビジュアルリグレッションテスト](visual-regression.md)を見てください。

## 1 つのファイルや 1 件だけを実行する

`npm test --` の後ろに、ファイルか名前を付けます。探すのは `unit` と `browser` だけなので、Playwright サーバーは要りません。

```sh
npm test -- test/unit/sum.test.ts           # 1 つのファイル
npm test -- test/browser/todo.test.ts
npm test -- -t '削除すると一覧から消える'   # 名前が一致するテストだけ
```

`-t` には正規表現を書きます。一致しないテストは飛ばされます。テストが出力するログも見たいときは、プロジェクトのスクリプトを使います。

```sh
npm run test:browser -- -t '削除すると一覧から消える'
```

## 保存するたびに実行し直す

```sh
npx vitest --project unit --project browser
```

`run` を付けないと、Vitest は終わらずに待ち、ファイルを保存するたびに、関係するテストを実行し直します。`h` でヘルプが出て、`q` で終わります。

## ブラウザーの画面を見る

`browser` プロジェクトは、ウィンドウを出さずに Chromium を動かします（`vitest.config.mts` の `headless: true`）。テストがアプリを操作する様子を見たいときは、これを外します。

```sh
npm run test:browser:headed                                 # ウィンドウが開いたまま待つ。q で終わる
npx vitest run --project browser --browser.headless=false   # テストが終わるとウィンドウが閉じる
```

開くのは Playwright が入れた Chromium で、「Google Chrome for Testing」という名前で表示されます。テストは 2 秒ほどで終わるので、`npm run test:browser:headed` は Vitest を終わらせずに待たせます。終わったあともウィンドウが開いたままなので画面を見られ、ファイルを保存すると実行し直します。どちらも Mac で実行してください。CI には、ウィンドウを出さない版の Chromium しか入れていません。

## 単体テスト

単体テストは、Vitest の機能の小さな例です。

| ファイル | 示していること |
|---|---|
| `sum.test.ts` | `src/sum.ts` の素直なテスト |
| `mock.test.ts` | `vi.fn`、`mock.calls` と `mock.results`、`vi.spyOn` |
| `async.test.ts` | 成功する Promise と失敗する Promise のテスト。`.then`／`.catch`、`.resolves`／`.rejects`、`await`、`expect.assertions` を付けた `try`／`catch` |
| `concurrent.test.ts` | `it.concurrent` と、ふつうに順番に動くテストの比較、フックの順番。順番はログにだけ出るので、`npm run test:unit -- test/unit/concurrent.test.ts` で実行する |
| `domByDefineProperty.test.ts` | `Object.defineProperty` で `window.location` を差し替える |

## ブラウザーのテスト

`test/browser/todo.test.ts` は、`vitest/browser` の `page` と `userEvent` で、[ToDo アプリ](todo-app.md)を Chromium の中で操作します。どのテストも、空にした `localStorage` でアプリを起動します。テスト全体で、追加、前後の空白、空白だけの名前と同じ名前、チェックの付け外し、削除とそのあとのフォーカスの移り先、同じ保存先でアプリを起動し直したときに残るタスクを確かめています。Browser Mode はページを読み込み直せないので、起動し直すことで再読み込みの代わりにしています。

## 型と lint

```sh
npm run typecheck   # tsc --noEmit。Vite と Vitest は型を検査しない
npm run lint        # ESLint のあと、ドキュメントの検査（npm run lint:docs）
```
