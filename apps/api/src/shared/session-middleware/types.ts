export const SESSION_COOKIE_NAME = "session_token";

// セッションの有効期間 (日)
export const SESSION_DURATION_DAYS = 30;

export type AuthSession = {
  userId: string;
  sessionToken: string;
  expiresAt: Date;
};

// Hono のコンテキストに載せる型。middleware が c.set("session", ...) する。
export type SessionEnv = {
  Variables: {
    session: AuthSession | null;
  };
};
