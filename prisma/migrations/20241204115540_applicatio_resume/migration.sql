/*
  Warnings:

  - You are about to drop the column `coverLetter` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `resumeUrl` on the `Application` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,jobPostingId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `resume` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Application` DROP COLUMN `coverLetter`,
    DROP COLUMN `resumeUrl`,
    ADD COLUMN `resume` TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Application_userId_jobPostingId_uk` ON `Application`(`userId`, `jobPostingId`);
