-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_videoId_fkey";

-- AlterTable
ALTER TABLE "Channel" ALTER COLUMN "videoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE SET NULL ON UPDATE CASCADE;
