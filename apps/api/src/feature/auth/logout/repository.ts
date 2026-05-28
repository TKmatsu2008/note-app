import { prisma } from "@repo/database";
import { ResultAsync } from "neverthrow";
import type { DbError } from "../../../shared/db-error";

export interface LogoutRepository {
  deleteByToken(sessionToken: string): ResultAsync<void, DbError>;
}

export class PrismaLogoutRepository implements LogoutRepository {
  deleteByToken(sessionToken: string): ResultAsync<void, DbError> {
    // deleteMany: 該当が無くてもエラーにしない
    return ResultAsync.fromPromise(
      prisma.session.deleteMany({ where: { sessionToken } }),
      (cause): DbError => ({ type: "DB_ERROR", cause }),
    ).map(() => undefined);
  }
}
