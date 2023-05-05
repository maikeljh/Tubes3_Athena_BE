import { Request, Response } from "express";
import { QnaService } from "../services/qna-service";

export class QnaController {
  private qnaService: QnaService;

  constructor(qnaService: QnaService) {
    this.qnaService = qnaService;
  }

  async getAllQna(req: Request, res: Response): Promise<void> {
    try {
      const allQna = await this.qnaService.getAllQna();
      res.status(200).json(allQna);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async createQna(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const createdQna = await this.qnaService.createQna(data);
      res.status(201).json(createdQna);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateQna(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const qnaId = Number(req.params.qnaId);
      const updatedQna = await this.qnaService.updateQna(data, qnaId);
      res.status(200).json(updatedQna);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteQna(req: Request, res: Response): Promise<void> {
    try {
      const qnaId = Number(req.params.qnaId);
      await this.qnaService.deleteQna(qnaId);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
