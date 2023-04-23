import { Prisma, Qna } from "@prisma/client";
import prisma from "../../prisma/prisma-client";

export class QnaService {
  async getAllQna(): Promise<Qna[]> {
    const allQna = await prisma.qna.findMany();
    return allQna;
  }

  async createQna(data: Prisma.QnaCreateInput): Promise<Qna> {
    const createdQna = await prisma.qna.create({
      data: {
        question: data.question,
        answer: data.answer,
      },
    });
    return createdQna;
  }

  async updateQna(data: Prisma.QnaCreateInput, qnaId: number): Promise<Qna> {
    const updatedQna = await prisma.qna.update({
      where: { qnaId: qnaId },
      data: {
        answer: data.answer,
      },
    });
    return updatedQna;
  }

  async deleteQna(qnaId: number): Promise<void> {
    await prisma.qna.delete({
      where: { qnaId: qnaId },
    });
  }
}
