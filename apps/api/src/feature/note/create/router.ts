import { OpenAPIHono } from "@hono/zod-openapi";
import { match } from "ts-pattern";
import { PrismaCreateNoteRepository } from "./repository";
import { CreateNoteRoute } from "./schema";
import { CreateNoteUseCase } from "./usecase";

export const createNoteRouter = () => {
  const app = new OpenAPIHono();

  // 手動DI: Repository を生成して UseCase に注入する
  const usecase = new CreateNoteUseCase(new PrismaCreateNoteRepository());

  app.openapi(CreateNoteRoute, async (c) => {
    const input = c.req.valid("json");

    const result = await usecase.execute(input);

    return result.match(
      (note) =>
        c.json(
          {
            id: note.id,
            title: note.title,
            content: note.content,
            createdAt: note.createdAt.toISOString(),
          },
          201,
        ),
      (error) =>
        match(error)
          .with("DB_ERROR", () =>
            c.json({ error: "ノートの保存に失敗しました" }, 500),
          )
          .exhaustive(),
    );
  });

  return app;
};
