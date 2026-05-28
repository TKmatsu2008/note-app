import type { Result } from "neverthrow";
import type { CreatedNote, CreateNoteRepository } from "./repository";

// 案A: 認証を実装するまでは固定のダミーユーザーIDを使う。
// DBを再接続したら、このIDの User 行が存在する必要がある(FK制約)。
// 認証の縦切りを追加したら、セッションから取得した本物のIDに差し替える。
const DUMMY_USER_ID = "dummy-user-id";

export type CreateNoteInput = {
  title: string;
  content: string;
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
        userId: DUMMY_USER_ID,
      })
      .mapErr((): CreateNoteError => "DB_ERROR");
  }
}
