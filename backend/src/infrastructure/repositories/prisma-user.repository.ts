import { User } from "@domain/entities/user.entity.js";
import type { UserRepository } from "@domain/repositories/user.repository.js";
import { Prisma } from "@prisma/client";
import { prismaClient } from "@infrastructure/database/prisma/prisma.client.js";

type PrismaUserRow = NonNullable<
  Awaited<ReturnType<typeof prismaClient.user.findUnique>>
>;

const toDomainUser = (row: PrismaUserRow): User => {
  return new User(
    row.id,
    row.fullname,
    row.email,
    row.passwordHash,
    row.createdAt,
    row.updatedAt
  );
};

const toPersistence = (user: User): Prisma.UserUncheckedCreateInput => ({
  id: user.id,
  fullname: user.fullname,
  email: user.email,
  passwordHash: user.passwordHashValue,
  updatedAt: user.updatedAt,
});

export class PrismaUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    await prismaClient.user.upsert({
      where: { id: user.id },
      update: toPersistence(user),
      create: {
        ...toPersistence(user),
        createdAt: user.createdAt,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await prismaClient.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    return row ? toDomainUser(row) : null;
  }

  async findById(id: string): Promise<User | null> {
    const row = await prismaClient.user.findUnique({
      where: { id },
    });

    return row ? toDomainUser(row) : null;
  }
}
