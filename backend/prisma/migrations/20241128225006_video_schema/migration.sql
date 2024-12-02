-- AlterEnum
ALTER TYPE "VideoProcessStatus" ADD VALUE 'failed';

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "description" TEXT,
ADD COLUMN     "video_url" TEXT;
