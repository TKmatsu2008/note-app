import { createRoute, z } from "@hono/zod-openapi";

export const LogoutResponse = z
  .object({ message: z.string() })
  .openapi("LogoutResponse");

export const LogoutErrorResponse = z
  .object({ error: z.string() })
  .openapi("LogoutErrorResponse");

export const LogoutRoute = createRoute({
  method: "post",
  path: "/auth/logout",
  description: "ログアウト (セッション削除 + クッキー破棄)",
  responses: {
    200: {
      content: { "application/json": { schema: LogoutResponse } },
      description: "ログアウト成功",
    },
    500: {
      content: { "application/json": { schema: LogoutErrorResponse } },
      description: "サーバーエラー",
    },
  },
});
