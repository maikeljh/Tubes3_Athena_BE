/*
  Warnings:

  - The primary key for the `message` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "message" DROP CONSTRAINT "message_pkey",
ADD CONSTRAINT "message_pkey" PRIMARY KEY ("message_id", "history_id", "user_id");
