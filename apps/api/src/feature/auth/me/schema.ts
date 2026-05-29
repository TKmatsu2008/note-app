import { createRoute, z } from "@hono/zod-openapi";

export const MeResponse = z
  .object({
    id: z.string(),
    email: z.string().nullable(),
    name: z.string().nullable(),
  })
  .openapi("MeResponse");

export const MeErrorResponse = z
  .object({ error: z.string() })
  .openapi("MeErrorResponse");

export const MeRoute = createRoute({
  method: "get",
  path: "/auth/me",
  description: "現在ログイン中のユーザーを返す",
  security: [{ sessionCookie: [] }],
  responses: {
    200: {
      content: { "application/json": { schema: MeResponse } },
      description: "ログイン中",
    },
    401: {
      content: { "application/json": { schema: MeErrorResponse } },
      description: "未ログイン",
    },
    500: {
      content: { "application/json": { schema: MeErrorResponse } },
      description: "サーバーエラー",
    },
  },
});
