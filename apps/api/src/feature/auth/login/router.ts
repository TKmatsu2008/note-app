import { OpenAPIHono } from "@hono/zod-openapi";
import { setCookie } from "hono/cookie";
import { match } from "ts-pattern";
import {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_DAYS,
  type SessionEnv,
} from "../../../shared/session-middleware/types";
import { PrismaLoginRepository } from "./repository";
import { LoginRoute } from "./schema";
import { LoginUseCase } from "./usecase";

export const loginRouter = () => {
  const app = new OpenAPIHono<SessionEnv>();

  const usecase = new LoginUseCase(new PrismaLoginRepository());

  app.openapi(LoginRoute, async (c) => {
    const input = c.req.valid("json");

    const result = await usecase.execute(input);

    return result.match(
      ({ sessionToken, user }) => {
        setCookie(c, SESSION_COOKIE_NAME, sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          path: "/",
          maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
        });
        return c.json({ id: user.id, email: user.email, name: user.name }, 200);
      },
      (error) =>
        match(error)
          .with("INVALID_CREDENTIALS", () =>
            c.json(
              { error: "メールアドレスまたはパスワードが正しくありません" },
              401,
            ),
          )
          .with("DB_ERROR", () =>
            c.json({ error: "ログインに失敗しました" }, 500),
          )
          .exhaustive(),
    );
  });

  return app;
};
