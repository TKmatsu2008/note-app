import { OpenAPIHono } from "@hono/zod-openapi";
import type { SessionEnv } from "../../../shared/session-middleware/types";
import { PrismaDeleteNoteRepository } from "./repository";
import { DeleteNoteRoute } from "./schema";

export const deleteNoteRouter = () => {
  const app = new OpenAPIHono<SessionEnv>();

  const repo = new PrismaDeleteNoteRepository();

  app.openapi(DeleteNoteRoute, async (c) => {
    const session = c.get("session");
    if (!session) {
      return c.json({ error: "ログインが必要です" }, 401);
    }

    const { id } = c.req.valid("param");

    const result = await repo.deleteForUser(id, session.userId);

    return result.match(
      (count) =>
        count > 0
          ? c.json({ message: "削除しました" }, 200)
          : c.json({ error: "ノートが見つかりません" }, 404),
      () => c.json({ error: "削除に失敗しました" }, 500),
    );
  });

  return app;
};
