import { Prisma, History } from "@prisma/client";
import prisma from "../../prisma/prisma-client";

export class HistoryService {
  async getAllHistory(): Promise<History[]> {
    const allHistory = await prisma.history.findMany();
    return allHistory;
  }

  async createUserHistory(data: any, userId: number): Promise<History> {
    const createdHistory = await prisma.history.create({
      data: {
        userId: userId,
        message: {
          create: {
            botMessage: data.botMessage,
            userMessage: data.userMessage,
            messageTimeStamp: new Date(),
          },
        },
      },
      include: {
        message: {
          select: {
            messageId: true,
            botMessage: true,
            userMessage: true,
          },
        },
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
