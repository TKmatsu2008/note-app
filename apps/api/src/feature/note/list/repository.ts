import { prisma } from "@repo/database";
import { ResultAsync } from "neverthrow";
import type { DbError } from "../../../shared/db-error";

export type NoteListItem = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
};

export interface ListNotesRepository {
  findByUserId(userId: string): ResultAsync<NoteListItem[], DbError>;
}

export class PrismaListNotesRepository implements ListNotesRepository {
  findByUserId(userId: string): ResultAsync<NoteListItem[], DbError> {
    return ResultAsync.fromPromise(
      prisma.note.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, content: true, createdAt: true },
      }),
      (cause): DbError => ({ type: "DB_ERROR", cause }),
    );
  }
}
