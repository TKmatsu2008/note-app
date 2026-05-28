import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// .env はリポジトリルートに置いている (DB再接続時に正式化予定)
config({ path: "../../.env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Prisma 7 では接続URLは schema ではなく config 側に置く (Migrate 用)。
  // 実行時の PrismaClient には別途 driver adapter が必要 (DB再接続時に対応)。
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
