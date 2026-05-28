import { createRoute, z } from "@hono/zod-openapi";

export const RegisterRequest = z
  .object({
    email: z.string().email({ message: "正しいメールアドレスを入力してください" }),
    password: z.string().min(8, { message: "パスワードは8文字以上にしてください" }),
    name: z.string().optional(),
  })
  .openapi("RegisterRequest");

export const RegisterResponse = z
  .object({
    id: z.string(),
    email: z.string(),
    name: z.string().nullable(),
  })
  .openapi("RegisterResponse");

export const RegisterErrorResponse = z
  .object({ error: z.string() })
  .openapi("RegisterErrorResponse");

export const RegisterRoute = createRoute({
  method: "post",
  path: "/auth/register",
  description: "ユーザー登録 (メール + パスワード)",
  request: {
    body: {
      content: { "application/json": { schema: RegisterRequest } },
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: RegisterResponse } },
      description: "登録成功",
    },
    409: {
      content: { "application/json": { schema: RegisterErrorResponse } },
      description: "メールアドレス重複",
    },
    500: {
      content: { "application/json": { schema: RegisterErrorResponse } },
      description: "サーバーエラー",
    },
  },
});
