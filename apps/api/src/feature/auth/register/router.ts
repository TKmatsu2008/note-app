import { OpenAPIHono } from "@hono/zod-openapi";
import { match } from "ts-pattern";
import type { SessionEnv } from "../../../shared/session-middleware/types";
import { PrismaRegisterRepository } from "./repository";
import { RegisterRoute } from "./schema";
import { RegisterUseCase } from "./usecase";

export const registerRouter = () => {
  const app = new OpenAPIHono<SessionEnv>();

  const usecase = new RegisterUseCase(new PrismaRegisterRepository());

  app.openapi(RegisterRoute, async (c) => {
    const input = c.req.valid("json");

    const result = await usecase.execute(input);

    return result.match(
      (user) => c.json({ id: user.id, email: user.email, name: user.name }, 201),
      (error) =>
        match(error)
          .with("EMAIL_TAKEN", () =>
            c.json({ error: "このメールアドレスは既に登録されています" }, 409),
          )
          .with("DB_ERROR", () => c.json({ error: "登録に失敗しました" }, 500))
          .exhaustive(),
    );
  });

  return app;
};
