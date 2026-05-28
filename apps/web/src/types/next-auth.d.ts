import type { DefaultSession } from "next-auth";

// NextAuth の Session.user に id を追加する型拡張
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
