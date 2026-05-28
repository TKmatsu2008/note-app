import bcrypt from "bcryptjs";
import { err, ok, type Result } from "neverthrow";
import type { RegisteredUser, RegisterRepository } from "./repository";

const BCRYPT_ROUNDS = 10;

export type RegisterInput = {
  email: string;
  password: string;
  name?: string;
};

export type RegisterError = "EMAIL_TAKEN" | "DB_ERROR";

export class RegisterUseCase {
  constructor(private readonly repo: RegisterRepository) {}

  async execute(
    input: RegisterInput,
  ): Promise<Result<RegisteredUser, RegisterError>> {
    const existing = await this.repo.findByEmail(input.email);
    if (existing.isErr()) return err("DB_ERROR");
    if (existing.value) return err("EMAIL_TAKEN");

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

    const created = await this.repo.create({
      email: input.email,
      passwordHash,
      name: input.name,
    });
    if (created.isErr()) return err("DB_ERROR");

    return ok(created.value);
  }
}
