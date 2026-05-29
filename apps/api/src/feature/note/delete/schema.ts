import { createRoute, z } from "@hono/zod-openapi";

export const DeleteNoteResponse = z
  .object({ message: z.string() })
  .openapi("DeleteNoteResponse");

export const DeleteNoteErrorResponse = z
  .object({ error: z.string() })
  .openapi("DeleteNoteErrorResponse");

export const DeleteNoteRoute = createRoute({
  method: "delete",
  path: "/notes/{id}",
  description: "ノートを削除する (自分のノートのみ, 要ログイン)",
  security: [{ sessionCookie: [] }],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      content: { "application/json": { schema: DeleteNoteResponse } },
      description: "削除成功",
    },
    401: {
      content: { "application/json": { schema: DeleteNoteErrorResponse } },
      description: "未ログイン",
    },
    404: {
      content: { "application/json": { schema: DeleteNoteErrorResponse } },
      description: "対象が無い / 自分のノートでない",
    },
    500: {
      content: { "application/json": { schema: DeleteNoteErrorResponse } },
      description: "サーバーエラー",
    },
  },
});
