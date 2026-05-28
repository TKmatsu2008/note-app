import type { Result } from "neverthrow";
import type { CreatedNote, CreateNoteRepository } from "./repository";

export type CreateNoteInput = {
  title: string;
  content: string;
  userId: string;
};

export type CreateNoteError = "DB_ERROR";

export class CreateNoteUseCase {
  // 手動DI: Repository は外から渡される (new はしない)
  constructor(private readonly repo: CreateNoteRepository) {}

  async execute(
    input: CreateNoteInput,
  ): Promise<Result<CreatedNote, CreateNoteError>> {
    return this.repo
      .create({
        title: input.title,
        content: input.content,
        userId: input.userId,
      })
      .mapErr((): CreateNoteError => "DB_ERROR");
  }
}
