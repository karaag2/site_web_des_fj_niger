import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

declare global {
  // allow global var across hot reloads in dev
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function getDatabaseUrl() {
  const rawUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
  if (rawUrl.startsWith('file:') && !rawUrl.includes('//')) {
    const path = require('path');
    return `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`;
  }
  return rawUrl;
}

function createPrismaClient() {
  const adapter = new PrismaLibSql({
    url: getDatabaseUrl(),
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
