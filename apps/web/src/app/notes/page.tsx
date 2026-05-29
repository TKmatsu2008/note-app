"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 初回ロード (未ログインは /login へ誘導)
  useEffect(() => {
    let ignore = false;
    (async () => {
      const res = await apiFetch("/notes");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!ignore && res.ok) {
        setNotes((await res.json()) as Note[]);
      }
      if (!ignore) {
        setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [router]);

  async function refresh() {
    const res = await apiFetch("/notes");
    if (res.ok) {
      setNotes((await res.json()) as Note[]);
    }
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await apiFetch("/notes", {
      method: "POST",
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      setTitle("");
      setContent("");
      await refresh();
      return;
    }
    const data = await res.json().catch(() => ({}));
    setError(data.error ?? "作成に失敗しました");
  }

  async function onDelete(id: string) {
    const res = await apiFetch(`/notes/${id}`, { method: "DELETE" });
    if (res.ok) {
      await refresh();
    }
  }

  if (loading) {
    return <main className="p-8">読み込み中...</main>;
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">ノート</h1>
        <Link href="/" className="text-sm underline">
          ホーム
        </Link>
      </div>

      <form onSubmit={onCreate} className="mb-8 flex flex-col gap-2">
        <input
          required
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded border px-3 py-2"
        />
        <textarea
          placeholder="本文"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-24 rounded border px-3 py-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="self-start rounded bg-black px-4 py-2 text-white"
        >
          作成
        </button>
      </form>

      <ul className="flex flex-col gap-3">
        {notes.length === 0 && (
          <li className="text-sm text-gray-500">ノートがありません</li>
        )}
        {notes.map((n) => (
          <li key={n.id} className="rounded border p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-bold">{n.title}</h2>
                <p className="whitespace-pre-wrap break-words text-sm">
                  {n.content}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDelete(n.id)}
                className="shrink-0 rounded border px-2 py-1 text-sm"
              >
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
