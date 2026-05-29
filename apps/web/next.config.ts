import type { NextConfig } from "next";

// ブラウザは web 自身の /bff/* を叩き、Next がそれを api に転送する(同一オリジン化)。
// これにより別サイト間の Cookie 制限を回避し、api の Cookie 認証をそのまま使える。
// 転送先の決定 (rewrite はビルド時に評価される):
//   1. API_URL 環境変数があればそれを使う (上書き可能)
//   2. 本番ビルドでは Render の api をデフォルトにする (Vercel の env 設定漏れでも動くように)
//   3. それ以外(ローカル開発)は localhost:3080
const apiUrl =
  process.env.API_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://note-app-hstp.onrender.com"
    : "http://localhost:3080");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/bff/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
