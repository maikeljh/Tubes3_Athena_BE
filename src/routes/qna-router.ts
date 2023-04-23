import express from "express";
import { QnaService } from "../services/qna-service";
import { QnaController } from "../controllers/qna-controller";

const qnaRouter = express.Router();
const qnaService = new QnaService();
const qnaController = new QnaController(qnaService);

qnaRouter.get("/qna", qnaController.getAllQna.bind(qnaController));
qnaRouter.post("/qna", qnaController.createQna.bind(qnaController));
qnaRouter.put("/qna/:qnaId", qnaController.updateQna.bind(qnaController));
qnaRouter.delete("/qna/:qnaId", qnaController.deleteQna.bind(qnaController));

export default qnaRouter;
