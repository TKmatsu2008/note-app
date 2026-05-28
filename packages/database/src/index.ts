import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Prisma 7 では new PrismaClient() に options(driver adapter 等)が必須。
// DB再接続時にここで adapter を渡す:
//   import { PrismaPg } from "@prisma/adapter-pg";
//   return new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}

// 遅延生成: 実際にプロパティへアクセスするまで PrismaClient を作らない。
// これにより DB に触れない経路(例: /health)は adapter 未設定でも起動できる。
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export * from "@prisma/client";
