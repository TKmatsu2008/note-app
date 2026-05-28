import { prisma } from "@repo/database";
import { ResultAsync } from "neverthrow";
import type { DbError } from "../../../shared/db-error";

export type RegisteredUser = {
  id: string;
  email: string;
  name: string | null;
};

export type CreateUserData = {
  email: string;
  passwordHash: string;
  name?: string;
};

export interface RegisterRepository {
  findByEmail(email: string): ResultAsync<{ id: string } | null, DbError>;
  create(data: CreateUserData): ResultAsync<RegisteredUser, DbError>;
}

export class PrismaRegisterRepository implements RegisterRepository {
  findByEmail(email: string): ResultAsync<{ id: string } | null, DbError> {
    return ResultAsync.fromPromise(
      prisma.user.findUnique({ where: { email }, select: { id: true } }),
      (cause): DbError => ({ type: "DB_ERROR", cause }),
    );
  }

  create(data: CreateUserData): ResultAsync<RegisteredUser, DbError> {
    return ResultAsync.fromPromise(
      prisma.user.create({
        data: {
          email: data.email,
          password: data.passwordHash,
          name: data.name,
        },
        select: { id: true, email: true, name: true },
      }),
      (cause): DbError => ({ type: "DB_ERROR", cause }),
    ).map((user) => ({
      id: user.id,
      email: user.email ?? data.email,
      name: user.name,
    }));
  }
}
