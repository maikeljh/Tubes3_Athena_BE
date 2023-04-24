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
    /* "We are implementing a 'manual' auto-increment
    of the messageId because if it were auto-incrementing,
    the auto-increment sequence would be preserved within different historyId.
    This would make the messageId unique, allowing it to identify
    a single record in the table. However, having a composite
    primary key (i.e. historyId and messageId) is not good practice,
    even though historyId alone can identify a single record.*/

    /* Currently, the 'manual' auto-increment implementation is not problematic
    because it is not possible to delete an individual record in the message table.However, it would cause issues if deleting an individual record were possible. */
    const userMessageCount = (
      await prisma.message.findMany({
        where: { historyId: historyId },
        select: { messageId: true },
      })
    ).length;

    const createdMessage = await prisma.message.create({
      data: {
        messageId: userMessageCount + 1,
        botMessage: data.botMessage,
        userMessage: data.userMessage,
        userId: userId,
        historyId: historyId,
      },
    });

    return createdMessage;
  }
}
