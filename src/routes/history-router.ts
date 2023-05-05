import express from "express";
import { HistoryService } from "../services/history-service";
import { HistoryController } from "../controllers/history-controller";

const historyRouter = express.Router();
const historyService = new HistoryService();
const historyController = new HistoryController(historyService);

historyRouter.get(
  "/history",
  historyController.getAllHistory.bind(historyController)
);
historyRouter.get(
  "/history/:userId",
  historyController.getAllUserHistory.bind(historyController)
);
historyRouter.post(
  "/history/:userId",
  historyController.createUserHistory.bind(historyController)
);
historyRouter.put(
  "/history/:userId/:historyId",
  historyController.updateUserHistoryTopic.bind(historyController)
);
historyRouter.delete(
  "/history/:userId",
  historyController.deleteAllUserHistory.bind(historyController)
);
historyRouter.delete(
  "/history/:userId/:historyId",
  historyController.deleteUserHistory.bind(historyController)
);

export default historyRouter;
