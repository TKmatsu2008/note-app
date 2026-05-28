import "dotenv/config";
import { serve } from "@hono/node-server";
import { app } from "./app";

const port = process.env.PORT ? Number(process.env.PORT) : 3080;

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`API server running on http://localhost:${info.port}`);
});
