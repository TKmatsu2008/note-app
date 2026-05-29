import { createRoute, z } from "@hono/zod-openapi";

export const NoteItem = z
  .object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    createdAt: z.string(),
  })
  .openapi("NoteItem");

export const ListNotesResponse = z.array(NoteItem).openapi("ListNotesResponse");

export const ListNotesErrorResponse = z
  .object({ error: z.string() })
  .openapi("ListNotesErrorResponse");

export const ListNotesRoute = createRoute({
  method: "get",
  path: "/notes",
  description: "ログインユーザーのノート一覧 (要ログイン)",
  security: [{ sessionCookie: [] }],
  responses: {
    200: {
      content: { "application/json": { schema: ListNotesResponse } },
      description: "一覧",
    },
    401: {
      content: { "application/json": { schema: ListNotesErrorResponse } },
      description: "未ログイン",
    },
    500: {
      content: { "application/json": { schema: ListNotesErrorResponse } },
      description: "サーバーエラー",
    },
  },
});
