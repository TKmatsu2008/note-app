import { createRoute, z } from "@hono/zod-openapi";

export const CreateNoteRequest = z
  .object({
    title: z.string().min(1, { message: "タイトルは必須です" }),
    content: z.string(),
  })
  .openapi("CreateNoteRequest");

export const CreateNoteResponse = z
  .object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    createdAt: z.string(),
  })
  .openapi("CreateNoteResponse");

export const CreateNoteErrorResponse = z
  .object({
    error: z.string(),
  })
  .openapi("CreateNoteErrorResponse");

export const CreateNoteRoute = createRoute({
  method: "post",
  path: "/notes",
  description: "ノートを1件作成する",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateNoteRequest,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: CreateNoteResponse,
        },
      },
      description: "作成成功",
    },
    500: {
      content: {
        "application/json": {
          schema: CreateNoteErrorResponse,
        },
      },
      description: "サーバーエラー",
    },
  },
});
