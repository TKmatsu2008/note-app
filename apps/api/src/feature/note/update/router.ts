import { OpenAPIHono } from "@hono/zod-openapi";
import type { SessionEnv } from "../../../shared/session-middleware/types";
import { PrismaUpdateNoteRepository } from "./repository";
import { UpdateNoteRoute } from "./schema";

export const updateNoteRouter = () => {
  const app = new OpenAPIHono<SessionEnv>();

  const repo = new PrismaUpdateNoteRepository();

  app.openapi(UpdateNoteRoute, async (c) => {
    const session = c.get("session");
    if (!session) {
      return c.json({ error: "ログインが必要です" }, 401);
    }

    const { id } = c.req.valid("param");
    const input = c.req.valid("json");

    const result = await repo.updateForUser(id, session.userId, input);

    return result.match(
      (note) =>
        note
          ? c.json(
              {
                id: note.id,
                title: note.title,
                content: note.content,
                createdAt: note.createdAt.toISOString(),
              },
              200,
            )
          : c.json({ error: "ノートが見つかりません" }, 404),
      () => c.json({ error: "更新に失敗しました" }, 500),
    );
  });

  return app;
};
