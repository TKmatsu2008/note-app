import { prisma } from "@repo/database";
import { ResultAsync } from "neverthrow";
import type { DbError } from "../../../shared/db-error";

export type CreatedNote = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
};

export type CreateNoteData = {
  title: string;
  content: string;
  userId: string;
};

// DB に対して「何ができるか」の契約 (interface)
export interface CreateNoteRepository {
  create(data: CreateNoteData): ResultAsync<CreatedNote, DbError>;
}

// Prisma を使った実装
export class PrismaCreateNoteRepository implements CreateNoteRepository {
  create(data: CreateNoteData): ResultAsync<CreatedNote, DbError> {
    return ResultAsync.fromPromise(
      prisma.note.create({
        data: {
          title: data.title,
          content: data.content,
          userId: data.userId,
        },
      }),
      (cause): DbError => ({ type: "DB_ERROR", cause }),
    ).map((note) => ({
      id: note.id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
    }));
  }
}
