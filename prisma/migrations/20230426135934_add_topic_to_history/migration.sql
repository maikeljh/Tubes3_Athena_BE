/*
  Warnings:

  - Added the required column `topic` to the `history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "history" ADD COLUMN "topic" TEXT NOT NULL;
