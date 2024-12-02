/*
  Warnings:

  - The values [Processing,Uploaded] on the enum `VideoProcessStatus` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VideoProcessStatus_new" AS ENUM ('preprocessing', 'uploaded');
ALTER TABLE "Video" ALTER COLUMN "processing_status" TYPE "VideoProcessStatus_new" USING ("processing_status"::text::"VideoProcessStatus_new");
ALTER TYPE "VideoProcessStatus" RENAME TO "VideoProcessStatus_old";
ALTER TYPE "VideoProcessStatus_new" RENAME TO "VideoProcessStatus";
DROP TYPE "VideoProcessStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Channel_userId_key" ON "Channel"("userId");

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
