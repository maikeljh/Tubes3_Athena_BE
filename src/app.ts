import express from "express";
import userRouter from "./routes/user-router";
import qnaRouter from "./routes/qna-router";
import historyRouter from "./routes/history-router";
import messageRouter from "./routes/message-router";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: true,
  })
);

app.use(express.json());
app.use("/", userRouter);
app.use("/", qnaRouter);
app.use("/", historyRouter);
app.use("/", messageRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>
  console.log(`🚀 Server ready at: http://localhost:${PORT}`)
);
