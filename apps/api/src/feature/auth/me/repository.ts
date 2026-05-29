import { prisma } from "@repo/database";
import { ResultAsync } from "neverthrow";
import type { DbError } from "../../../shared/db-error";

export type MeUser = {
  id: string;
  email: string | null;
  name: string | null;
};

export interface MeRepository {
  findById(userId: string): ResultAsync<MeUser | null, DbError>;
}

export class PrismaMeRepository implements MeRepository {
  findById(userId: string): ResultAsync<MeUser | null, DbError> {
    return ResultAsync.fromPromise(
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true },
      }),
      (cause): DbError => ({ type: "DB_ERROR", cause }),
    );
  }
}
