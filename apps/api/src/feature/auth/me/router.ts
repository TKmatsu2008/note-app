import { OpenAPIHono } from "@hono/zod-openapi";
import type { SessionEnv } from "../../../shared/session-middleware/types";
import { PrismaMeRepository } from "./repository";
import { MeRoute } from "./schema";

export const meRouter = () => {
  const app = new OpenAPIHono<SessionEnv>();

  const repo = new PrismaMeRepository();

  app.openapi(MeRoute, async (c) => {
    const session = c.get("session");
    if (!session) {
      return c.json({ error: "ログインが必要です" }, 401);
    }

    const result = await repo.findById(session.userId);

    return result.match(
      (user) =>
        user
          ? c.json({ id: user.id, email: user.email, name: user.name }, 200)
          : c.json({ error: "ログインが必要です" }, 401),
      () => c.json({ error: "サーバーエラーが発生しました" }, 500),
    );
  });

  return app;
};
