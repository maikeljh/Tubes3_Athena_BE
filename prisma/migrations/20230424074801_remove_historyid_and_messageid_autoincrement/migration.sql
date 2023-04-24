-- AlterTable
ALTER TABLE "history" ALTER COLUMN "history_id" DROP DEFAULT;
DROP SEQUENCE "history_history_id_seq";

-- AlterTable
ALTER TABLE "message" ALTER COLUMN "message_id" DROP DEFAULT;
DROP SEQUENCE "message_message_id_seq";
