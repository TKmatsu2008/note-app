import { OpenAPIHono } from "@hono/zod-openapi";
import type { SessionEnv } from "../../../shared/session-middleware/types";
import { PrismaListNotesRepository } from "./repository";
import { ListNotesRoute } from "./schema";

export const listNotesRouter = () => {
  const app = new OpenAPIHono<SessionEnv>();

  const repo = new PrismaListNotesRepository();

  app.openapi(ListNotesRoute, async (c) => {
    const session = c.get("session");
    if (!session) {
      return c.json({ error: "ログインが必要です" }, 401);
    }

    const result = await repo.findByUserId(session.userId);

    return result.match(
      (notes) =>
        c.json(
          notes.map((n) => ({
            id: n.id,
            title: n.title,
            content: n.content,
            createdAt: n.createdAt.toISOString(),
          })),
          200,
        ),
      () => c.json({ error: "ノートの取得に失敗しました" }, 500),
    );
  });

  return app;
};
