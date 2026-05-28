import { prisma } from "@repo/database";
import { ResultAsync } from "neverthrow";
import type { DbError } from "../../../shared/db-error";

export type LoginUser = {
  id: string;
  email: string | null;
  name: string | null;
  passwordHash: string | null;
};

export type CreateSessionData = {
  sessionToken: string;
  userId: string;
  expires: Date;
};

export interface LoginRepository {
  findByEmail(email: string): ResultAsync<LoginUser | null, DbError>;
  createSession(data: CreateSessionData): ResultAsync<void, DbError>;
}

export class PrismaLoginRepository implements LoginRepository {
  findByEmail(email: string): ResultAsync<LoginUser | null, DbError> {
    return ResultAsync.fromPromise(
      prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, name: true, password: true },
      }),
      (cause): DbError => ({ type: "DB_ERROR", cause }),
    ).map((user) =>
      user
        ? {
            id: user.id,
            email: user.email,
            name: user.name,
            passwordHash: user.password,
          }
        : null,
    );
  }

  createSession(data: CreateSessionData): ResultAsync<void, DbError> {
    return ResultAsync.fromPromise(
      prisma.session.create({
        data: {
          sessionToken: data.sessionToken,
          userId: data.userId,
          expires: data.expires,
        },
      }),
      (cause): DbError => ({ type: "DB_ERROR", cause }),
    ).map(() => undefined);
  }
}
