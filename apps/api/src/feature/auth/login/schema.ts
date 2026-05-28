import { createRoute, z } from "@hono/zod-openapi";

export const LoginRequest = z
  .object({
    email: z.string().email({ message: "正しいメールアドレスを入力してください" }),
    password: z.string().min(1, { message: "パスワードは必須です" }),
  })
  .openapi("LoginRequest");

export const LoginResponse = z
  .object({
    id: z.string(),
    email: z.string(),
    name: z.string().nullable(),
  })
  .openapi("LoginResponse");

export const LoginErrorResponse = z
  .object({ error: z.string() })
  .openapi("LoginErrorResponse");

export const LoginRoute = createRoute({
  method: "post",
  path: "/auth/login",
  description: "ログイン (成功時に session_token クッキーを発行)",
  request: {
    body: {
      content: { "application/json": { schema: LoginRequest } },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: LoginResponse } },
      description: "ログイン成功",
    },
    401: {
      content: { "application/json": { schema: LoginErrorResponse } },
      description: "認証失敗",
    },
    500: {
      content: { "application/json": { schema: LoginErrorResponse } },
      description: "サーバーエラー",
    },
  },
});
