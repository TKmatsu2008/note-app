// api 呼び出しは web 自身の /bff/* を叩く。next.config の rewrite が Render の api へ転送する。
// 同一オリジンなので Cookie(セッション)がそのまま使える。
const BFF_BASE = "/bff";

export function apiFetch(path: string, options: RequestInit = {}) {
  return fetch(`${BFF_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
}
