import { createRoute, z } from "@hono/zod-openapi";

export const UpdateNoteRequest = z
  .object({
    title: z.string().min(1, { message: "タイトルは必須です" }),
    content: z.string(),
  })
  .openapi("UpdateNoteRequest");

export const UpdateNoteResponse = z
  .object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    createdAt: z.string(),
  })
  .openapi("UpdateNoteResponse");

export const UpdateNoteErrorResponse = z
  .object({ error: z.string() })
  .openapi("UpdateNoteErrorResponse");

export const UpdateNoteRoute = createRoute({
  method: "put",
  path: "/notes/{id}",
  description: "ノートを更新する (自分のノートのみ, 要ログイン)",
  security: [{ sessionCookie: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: { "application/json": { schema: UpdateNoteRequest } },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: UpdateNoteResponse } },
      description: "更新成功",
    },
    401: {
      content: { "application/json": { schema: UpdateNoteErrorResponse } },
      description: "未ログイン",
    },
    404: {
      content: { "application/json": { schema: UpdateNoteErrorResponse } },
      description: "対象が無い / 自分のノートでない",
    },
    500: {
      content: { "application/json": { schema: UpdateNoteErrorResponse } },
      description: "サーバーエラー",
    },
  },
});
