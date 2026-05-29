"use client";

import dynamic from "next/dynamic";

// CSSはグローバルに適用されるため、ここでインポートします。
// Note: 本来はルートのlayout.tsxで読み込むのがより一般的です。
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import AuthStatus from "@/components/auth-status";

// 作成したEditorコンポーネントをクライアントサイドでのみ動的に読み込む
// ssr: false オプションでサーバーサイドレンダリングを無効化する
const Editor = dynamic(() => import("../components/editor"), { ssr: false });

export default function Home() {
  return (
    <div>
      <header className="flex items-center justify-between border-b px-4 py-2">
        <span className="font-bold">Note App</span>
        <AuthStatus />
      </header>
      <main>
        <div className="h-[90vh] w-[90vw]">
          <Editor />
        </div>
      </main>
    </div>
  );
}
