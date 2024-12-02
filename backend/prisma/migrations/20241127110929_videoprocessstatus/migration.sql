-- CreateEnum
CREATE TYPE "VideoProcessStatus" AS ENUM ('Processing', 'Uploaded');

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "processing_status" "VideoProcessStatus",
ADD COLUMN     "qualities" JSONB;
