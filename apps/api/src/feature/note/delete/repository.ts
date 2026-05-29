import { prisma } from "@repo/database";
import { ResultAsync } from "neverthrow";
import type { DbError } from "../../../shared/db-error";

export interface DeleteNoteRepository {
  // 自分(userId)のノートのみ削除。削除件数を返す(0なら対象なし)。
  deleteForUser(id: string, userId: string): ResultAsync<number, DbError>;
}

export class PrismaDeleteNoteRepository implements DeleteNoteRepository {
  deleteForUser(id: string, userId: string): ResultAsync<number, DbError> {
    return ResultAsync.fromPromise(
      prisma.note.deleteMany({ where: { id, userId } }),
      (cause): DbError => ({ type: "DB_ERROR", cause }),
    ).map((r) => r.count);
  }
}
