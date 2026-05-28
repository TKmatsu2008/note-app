import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node22",
  clean: true,
  // ワークスペース内部パッケージ(TSソース)はバンドルに含める。
  // @prisma/client は external のまま(生成物を実行時に解決)。
  noExternal: ["@repo/database"],
});
