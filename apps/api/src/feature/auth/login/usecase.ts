import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { err, ok, type Result } from "neverthrow";
import { SESSION_DURATION_DAYS } from "../../../shared/session-middleware/types";
import type { LoginRepository } from "./repository";

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginOutput = {
  sessionToken: string;
  expiresAt: Date;
  user: { id: string; email: string; name: string | null };
};

export type LoginError = "INVALID_CREDENTIALS" | "DB_ERROR";

export class LoginUseCase {
  constructor(private readonly repo: LoginRepository) {}

  async execute(input: LoginInput): Promise<Result<LoginOutput, LoginError>> {
    const userResult = await this.repo.findByEmail(input.email);
    if (userResult.isErr()) return err("DB_ERROR");

    const user = userResult.value;
    // ユーザー不在 or パスワード未設定は、存在を伏せるため一律 INVALID_CREDENTIALS
    if (!user || !user.passwordHash) return err("INVALID_CREDENTIALS");

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) return err("INVALID_CREDENTIALS");

    const sessionToken = randomUUID();
    const expiresAt = new Date(
      Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
    );

    const created = await this.repo.createSession({
      sessionToken,
      userId: user.id,
      expires: expiresAt,
    });
    if (created.isErr()) return err("DB_ERROR");

    return ok({
      sessionToken,
      expiresAt,
      user: { id: user.id, email: user.email ?? input.email, name: user.name },
    });
  }
}
