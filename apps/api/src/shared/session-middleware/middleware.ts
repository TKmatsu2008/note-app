import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { findSessionByToken } from "./repository";
import { SESSION_COOKIE_NAME, type SessionEnv } from "./types";

// 毎リクエストで Cookie を読み、有効なセッションがあれば c.var.session に載せる。
// 認証必須かどうかは各ルーター側で session の有無を見て判断する。
export const sessionMiddleware = createMiddleware<SessionEnv>(async (c, next) => {
  const token = getCookie(c, SESSION_COOKIE_NAME);

  if (!token) {
    c.set("session", null);
    await next();
    return;
  }

  const result = await findSessionByToken(token);
  c.set("session", result.isOk() ? result.value : null);
  await next();
});
