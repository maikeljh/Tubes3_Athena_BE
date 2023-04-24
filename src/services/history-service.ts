import { Prisma, History } from "@prisma/client";
import prisma from "../../prisma/prisma-client";

export class HistoryService {
  async getAllHistory(): Promise<History[]> {
    const allHistory = await prisma.history.findMany();
    return allHistory;
  }

  async createUserHistory(userId: number): Promise<History> {
    const nextHistoryId = await this.findnextHistoryId(userId);

    const createdHistory = await prisma.history.create({
      data: {
        historyId: nextHistoryId,
        userId: userId,
      },
    });

    return createdHistory;
  }

  private async findnextHistoryId(userId: number) {
    // Find all distinct userId from the history table
    const userIds = await prisma.history
      .findMany({
        distinct: ["userId"],
        select: { userId: true },
      })
      .then((histories) => histories.map((history) => history.userId));

    const sequence_name = `history_history_id_user_${userId}_seq`;

    // If the userId does not have a single history
    if (!userIds.includes(userId)) {
      // Create a new sequence
      // Every user has a sequence for their historyId

      // We use $queryRawUnsafe because it is not possible to interpolate
      // names with $queryRaw. However, this opens up the risk of SQL injection attacks.
      // See https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#dynamic-table-names-in-postgresql
      await prisma.$queryRawUnsafe(
        `CREATE SEQUENCE ${sequence_name} AS integer;`
      );
    }

    type NextValResult = {
      nextval: number;
    };

    // Get the next value from the sequence
    const nextHistoryId = await prisma.$queryRawUnsafe<NextValResult[]>(
      `SELECT NEXTVAL('${sequence_name}');`
    );
    console.log(nextHistoryId);
    console.log(nextHistoryId[0].nextval);
    console.log(Number(nextHistoryId[0].nextval));

    return Number(nextHistoryId[0].nextval);
  }

  async deleteAllUserHistory(userId: number): Promise<void> {
    await prisma.history.deleteMany({
      where: { userId: userId },
    });

    const sequence_name = `history_history_id_user_${userId}_seq`;

    // We use $queryRawUnsafe because it is not possible to interpolate
    // names with $queryRaw. However, this opens up the risk of SQL injection attacks.
    // See https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#dynamic-table-names-in-postgresql
    await prisma.$queryRawUnsafe(`DROP SEQUENCE ${sequence_name};`);
  }

  async deleteUserHistory(userId: number, historyId: number): Promise<void> {
    await prisma.history.delete({
      where: {
        historyId_userId: {
          historyId: historyId,
          userId: userId,
        },
      },
    });
  }
}
