import { err, ok, type Result } from "neverthrow";
import type { LogoutRepository } from "./repository";

export type LogoutError = "DB_ERROR";

export class LogoutUseCase {
  constructor(private readonly repo: LogoutRepository) {}

  async execute(
    sessionToken: string | undefined,
  ): Promise<Result<void, LogoutError>> {
    // トークンが無い(=既に未ログイン)場合も成功扱い
    if (!sessionToken) return ok(undefined);

    const deleted = await this.repo.deleteByToken(sessionToken);
    if (deleted.isErr()) return err("DB_ERROR");

    return ok(undefined);
  }
}
