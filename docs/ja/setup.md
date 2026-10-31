[English](../en/setup.md) | 日本語

# 準備

## 必要なもの

- Node 24。CI も Node 24 を使います。
- npm。`.npmrc` の設定で、公開から 2 日たっていない版は入れません。
- ビジュアルリグレッションテストには、コンテナを動かす環境が要ります。ブラウザーをコンテナの中で動かすためです。既定では Apple シリコンの Mac の [Apple Container](https://github.com/apple/container) を使い、`CONTAINER_RUNTIME=docker` を付けると CI と同じく Docker を使います。ほかのテストに要るのは、Node と、下で入れる Chromium だけです。

## 依存を入れる

```sh
npm ci
npx playwright install chromium   # ブラウザーのテストに使うブラウザー
```

ビジュアルリグレッションテストは、このブラウザーを使いません。[ビジュアルリグレッションテスト](visual-regression.md)を見てください。

## 開発用コンテナ

`Dockerfile.dev` から作るコンテナの中でも作業できます。このファイルと、起動時に動くスクリプトをダウンロードします。

```sh
curl -L -O https://raw.githubusercontent.com/uraitakahito/hello-javascript/refs/tags/1.2.1/Dockerfile.dev
curl -L -O https://raw.githubusercontent.com/uraitakahito/hello-javascript/refs/tags/1.2.1/docker-entrypoint.sh
chmod 755 docker-entrypoint.sh
```

コンテナの作り方と起動のしかたは、`Dockerfile.dev` の冒頭に書いてあります。2 つのファイルは git の管理外です。

このコンテナはポートを公開していないので、中で起動したサーバーには、外のブラウザーからつながりません。Playwright サーバーも、それ自体がコンテナで動くので、このコンテナの中からは起動できません。`npm run dev` とビジュアルリグレッションテストは、ホストで実行してください。
