import type { NextConfig } from "next";

// ブラウザは web 自身の /bff/* を叩き、Next がそれを api に転送する(同一オリジン化)。
// これにより別サイト間の Cookie 制限を回避し、api の Cookie 認証をそのまま使える。
// API_URL: ローカルは既定の localhost:3080、本番(Vercel)では Render の URL を環境変数で指定。
const apiUrl = process.env.API_URL ?? "http://localhost:3080";

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
