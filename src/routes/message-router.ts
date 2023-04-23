import express from "express";
import { MessageService } from "../services/message-service";
import { MessageController } from "../controllers/message-controller";

const messageRouter = express.Router();
const messageService = new MessageService();
const messageController = new MessageController(messageService);

messageRouter.get(
  "/message/:userId/:historyId",
  messageController.getAllMessagesInUserHistory.bind(messageController)
);
messageRouter.post(
  "/message/:userId/:historyId",
  messageController.createMessageInUserHistory.bind(messageController)
);

export default messageRouter;
