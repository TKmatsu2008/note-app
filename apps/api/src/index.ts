import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "@hono/node-server";
import { config } from "dotenv";
import { app } from "./app";

// リポジトリルートの .env を読み込む (apps/api/src・apps/api/dist どちらからでも root を指す)
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../../.env") });

const port = process.env.PORT ? Number(process.env.PORT) : 3080;

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`API server running on http://localhost:${info.port}`);
});
