"use client";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

// BlockNoteエディタをレンダリングするクライアントコンポーネント
export default function Editor() {
  // エディタのインスタンスを作成します。
  // このフックは内部でwindowオブジェクトを参照するため、クライアントサイドでのみ動作します。
  const editor = useCreateBlockNote();

  // エディタをレンダリングします。
  return <BlockNoteView editor={editor} />;
}