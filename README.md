## Setup

Please download the required files by following these steps:

```
curl -L -O https://raw.githubusercontent.com/uraitakahito/hello-javascript/refs/tags/1.2.1/Dockerfile.dev
curl -L -O https://raw.githubusercontent.com/uraitakahito/hello-javascript/refs/tags/1.2.1/docker-entrypoint.sh
chmod 755 docker-entrypoint.sh
```

Detailed environment setup instructions are described at the beginning of the `Dockerfile`.

```console
% vitest run test/sum.test.ts
```
