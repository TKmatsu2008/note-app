import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { loginRouter } from "./feature/auth/login/router";
import { logoutRouter } from "./feature/auth/logout/router";
import { meRouter } from "./feature/auth/me/router";
import { registerRouter } from "./feature/auth/register/router";
import { createNoteRouter } from "./feature/note/create/router";
import { sessionMiddleware } from "./shared/session-middleware/middleware";
import type { SessionEnv } from "./shared/session-middleware/types";

export const app = new OpenAPIHono<SessionEnv>();

app.use(
  "*",
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type"],
    credentials: true,
  }),
);

// 毎リクエストで Cookie を見てセッションを c.var.session に載せる
app.use("*", sessionMiddleware);

app.get("/health", (c) => c.json({ status: "OK" }));

// 認証
app.route("/", registerRouter());
app.route("/", loginRouter());
app.route("/", logoutRouter());
app.route("/", meRouter());

// ノート
app.route("/", createNoteRouter());

app.openAPIRegistry.registerComponent("securitySchemes", "sessionCookie", {
  type: "apiKey",
  in: "cookie",
  name: "session_token",
});

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Note App API",
  },
});
