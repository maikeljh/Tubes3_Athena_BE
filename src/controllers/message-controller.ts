import { Request, Response } from "express";
import { MessageService } from "../services/message-service";

export class MessageController {
  private messageService: MessageService;
  
  constructor(messageService: MessageService) {
    this.messageService = messageService;
  }

  async getAllMessagesInUserHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.params.userId);
      const historyId = Number(req.params.historyId);
      const allMessages = await this.messageService.getAllMessagesInUserHistory(userId, historyId);
      res.status(200).json(allMessages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async createMessageInUserHistory(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const userId = Number(req.params.userId);
      const historyId = Number(req.params.historyId);
      const algorithm = String(req.query.algo);
      const allMessages = await this.messageService.createMessageInUserHistory(data, userId, historyId, algorithm);
      res.status(201).json(allMessages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}