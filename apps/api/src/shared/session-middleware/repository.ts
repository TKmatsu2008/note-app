import { prisma } from "@repo/database";
import { ResultAsync } from "neverthrow";
import type { DbError } from "../db-error";
import type { AuthSession } from "./types";

// Cookie のトークンから有効なセッションを引く。期限切れ・未存在は null。
export const findSessionByToken = (
  sessionToken: string,
): ResultAsync<AuthSession | null, DbError> => {
  return ResultAsync.fromPromise(
    prisma.session.findUnique({ where: { sessionToken } }),
    (cause): DbError => ({ type: "DB_ERROR", cause }),
  ).map((session) => {
    if (!session) return null;
    if (session.expires < new Date()) return null;
    return {
      userId: session.userId,
      sessionToken: session.sessionToken,
      expiresAt: session.expires,
    };
  });
};
