import { Prisma, History } from "@prisma/client";
import prisma from "../../prisma/prisma-client";

export class HistoryService {
  async getAllHistory(): Promise<History[]> {
    const allHistory = await prisma.history.findMany();
    return allHistory;
  }

  async createUserHistory(userId: number): Promise<History> {
    const createdHistory = await prisma.history.create({
      data: {
        userId: userId,
      },
    });
    return createdHistory;
  }

  async deleteAllUserHistory(userId: number): Promise<void> {
    await prisma.history.deleteMany({
      where: { userId: userId },
    });
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
