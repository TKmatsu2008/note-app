# syntax=docker/dockerfile:1
# ビルドコンテキストはリポジトリルート想定:
#   docker build -f apps/api/Dockerfile -t note-api .

FROM node:22-slim AS builder
RUN corepack enable && \
    apt-get update -y && apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app

# 依存解決に必要なファイルを先にコピー (レイヤキャッシュを効かせる)
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/database/package.json packages/database/package.json
# postinstall(prisma generate)に schema/config が必要
COPY packages/database/prisma packages/database/prisma
COPY packages/database/prisma.config.ts packages/database/prisma.config.ts

# api とその依存(database)だけインストール
RUN pnpm install --frozen-lockfile --filter api...

# ソースをコピーしてビルド
COPY packages/database packages/database
COPY apps/api apps/api
RUN pnpm --filter api build

# ---- 実行ステージ ----
FROM node:22-slim AS runner
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production

# pnpm のシンボリックリンク構造を保つため、まるごとコピーする
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

# Cloud Run は PORT 環境変数を注入する (既定 8080)。index.ts が参照する。
EXPOSE 8080
CMD ["node", "apps/api/dist/index.js"]
