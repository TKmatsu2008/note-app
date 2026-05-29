import { prisma } from "@repo/database";
import { okAsync, ResultAsync } from "neverthrow";
import type { DbError } from "../../../shared/db-error";

export type UpdatedNote = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
};

export type UpdateNoteData = {
  title: string;
  content: string;
};

export interface UpdateNoteRepository {
  // 自分(userId)のノートのみ更新。対象が無ければ null。
  updateForUser(
    id: string,
    userId: string,
    data: UpdateNoteData,
  ): ResultAsync<UpdatedNote | null, DbError>;
}

const toDbError = (cause: unknown): DbError => ({ type: "DB_ERROR", cause });

export class PrismaUpdateNoteRepository implements UpdateNoteRepository {
  updateForUser(
    id: string,
    userId: string,
    data: UpdateNoteData,
  ): ResultAsync<UpdatedNote | null, DbError> {
    // updateMany で所有者(userId)を条件に含めて他人のノートは更新させない
    return ResultAsync.fromPromise(
      prisma.note.updateMany({
        where: { id, userId },
        data: { title: data.title, content: data.content },
      }),
      toDbError,
    ).andThen((res) =>
      res.count === 0
        ? okAsync<UpdatedNote | null, DbError>(null)
        : ResultAsync.fromPromise(
            prisma.note.findUnique({
              where: { id },
              select: { id: true, title: true, content: true, createdAt: true },
            }),
            toDbError,
          ),
    );
  }
}
