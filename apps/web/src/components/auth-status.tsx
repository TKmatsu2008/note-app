"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Me = { id: string; email: string | null; name: string | null };

export default function AuthStatus() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/auth/me")
      .then((r) => (r.ok ? (r.json() as Promise<Me>) : null))
      .then((d) => setMe(d))
      .catch(() => setMe(null))
      .finally(() => setLoading(false));
  }, []);

  async function logout() {
    await apiFetch("/auth/logout", { method: "POST" });
    setMe(null);
    router.refresh();
  }

  if (loading) {
    return <span className="text-sm text-gray-500">確認中...</span>;
  }

  if (me) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span>{me.name ?? me.email} でログイン中</span>
        <button
          type="button"
          onClick={logout}
          className="rounded border px-2 py-1"
        >
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <Link href="/login" className="underline">
        ログイン
      </Link>
      <Link href="/register" className="underline">
        新規登録
      </Link>
    </div>
  );
}
