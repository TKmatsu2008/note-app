import { OpenAPIHono } from "@hono/zod-openapi";
import { deleteCookie, getCookie } from "hono/cookie";
import { match } from "ts-pattern";
import {
  SESSION_COOKIE_NAME,
  type SessionEnv,
} from "../../../shared/session-middleware/types";
import { PrismaLogoutRepository } from "./repository";
import { LogoutRoute } from "./schema";
import { LogoutUseCase } from "./usecase";

export const logoutRouter = () => {
  const app = new OpenAPIHono<SessionEnv>();

  const usecase = new LogoutUseCase(new PrismaLogoutRepository());

  app.openapi(LogoutRoute, async (c) => {
    const token = getCookie(c, SESSION_COOKIE_NAME);

    const result = await usecase.execute(token);

    // 成否に関わらずクッキーは破棄する
    deleteCookie(c, SESSION_COOKIE_NAME, { path: "/" });

    return result.match(
      () => c.json({ message: "ログアウトしました" }, 200),
      (error) =>
        match(error)
          .with("DB_ERROR", () =>
            c.json({ error: "ログアウトに失敗しました" }, 500),
          )
          .exhaustive(),
    );
  });

  return app;
};
