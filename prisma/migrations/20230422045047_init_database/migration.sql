-- CreateTable
CREATE TABLE "user" (
    "user_id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "qna" (
    "qna_id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "qna_pkey" PRIMARY KEY ("qna_id")
);

-- CreateTable
CREATE TABLE "history" (
    "history_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "history_pkey" PRIMARY KEY ("history_id","user_id")
);

-- CreateTable
CREATE TABLE "message" (
    "message_id" SERIAL NOT NULL,
    "bot_message" TEXT NOT NULL,
    "user_message" TEXT NOT NULL,
    "message_time_stamp" TIMESTAMP(3) NOT NULL,
    "history_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "message_pkey" PRIMARY KEY ("message_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "qna_question_idx" ON "qna"("question");

-- CreateIndex
CREATE INDEX "message_message_time_stamp_idx" ON "message"("message_time_stamp" ASC);

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_history_id_user_id_fkey" FOREIGN KEY ("history_id", "user_id") REFERENCES "history"("history_id", "user_id") ON DELETE CASCADE ON UPDATE CASCADE;
