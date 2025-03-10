import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function cleanDatabase() {
    await prisma.$transaction([
        prisma.transaction.deleteMany(),
        prisma.balance.deleteMany(),
        prisma.user.deleteMany()
    ]);
}

export { prisma };
