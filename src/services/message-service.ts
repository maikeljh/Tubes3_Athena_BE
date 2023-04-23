import { Message, Prisma } from "@prisma/client";
import prisma from "../../prisma/prisma-client";

export class MessageService {
  async getAllMessagesInUserHistory(
    userId: number,
    historyId: number
  ): Promise<Message[]> {
    const allMessages = await prisma.message.findMany({
      where: {
        userId: userId,
        historyId: historyId,
      },
    });
    return allMessages;
  }

  async createMessageInUserHistory(
    data: any,
    userId: number,
    historyId: number,
    algorithm: string // Algorithm is not used for now. TODO: Add more logic to use it.
  ): Promise<Message> {
    const createdMessage = await prisma.message.create({
      data: {
        botMessage: data.botMessage,
        userMessage: data.userMessage,
        userId: userId,
        historyId: historyId,
      },
    });
    return createdMessage;
  }
}
