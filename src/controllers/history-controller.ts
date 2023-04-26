import { Request, Response } from "express";
import { HistoryService } from "../services/history-service";

export class HistoryController {
  private historyService: HistoryService;

  constructor(historyService: HistoryService) {
    this.historyService = historyService;
  }

  async getAllHistory(req: Request, res: Response) {
    try {
      const allHistory = await this.historyService.getAllHistory();
      res.status(200).json(allHistory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAllUserHistory(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const allHistory = await this.historyService.getAllUserHistory(userId);
      res.status(200).json(allHistory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateUserHistoryTopic(req: Request, res: Response){
    try {
      const userId = Number(req.params.userId);
      const historyId = Number(req.params.historyId);
      const data = req.body;
      const allHistory = await this.historyService.updateUserHistoryTopic(data, userId, historyId);
      res.status(200).json(allHistory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async createUserHistory(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const createdHistory = await this.historyService.createUserHistory(
        userId, "History"
      );
      res.status(201).json(createdHistory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }


  async deleteAllUserHistory(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      await this.historyService.deleteAllUserHistory(userId);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteUserHistory(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const historyId = Number(req.params.historyId);
      await this.historyService.deleteUserHistory(userId, historyId);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
