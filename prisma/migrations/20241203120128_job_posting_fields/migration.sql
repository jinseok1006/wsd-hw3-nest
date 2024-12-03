/*
  Warnings:

  - You are about to drop the column `companySize` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `employeeCount` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `establishedDate` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `industry` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `operatingProfit` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `revenue` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `welfareBenefits` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `educationLevel` on the `JobPosting` table. All the data in the column will be lost.
  - You are about to drop the column `isSalaryDetermined` on the `JobPosting` table. All the data in the column will be lost.
  - You are about to drop the column `jobPosition` on the `JobPosting` table. All the data in the column will be lost.
  - You are about to drop the column `jobType` on the `JobPosting` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `JobPosting` table. All the data in the column will be lost.
  - You are about to drop the column `requirements` on the `JobPosting` table. All the data in the column will be lost.
  - Made the column `description` on table `JobPosting` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Company` DROP COLUMN `companySize`,
    DROP COLUMN `employeeCount`,
    DROP COLUMN `establishedDate`,
    DROP COLUMN `industry`,
    DROP COLUMN `location`,
    DROP COLUMN `operatingProfit`,
    DROP COLUMN `revenue`,
    DROP COLUMN `welfareBenefits`;

-- AlterTable
ALTER TABLE `JobPosting` DROP COLUMN `educationLevel`,
    DROP COLUMN `isSalaryDetermined`,
    DROP COLUMN `jobPosition`,
    DROP COLUMN `jobType`,
    DROP COLUMN `location`,
    DROP COLUMN `requirements`,
    ADD COLUMN `locationDescription` VARCHAR(191) NULL,
    MODIFY `description` TEXT NOT NULL;

-- CreateTable
CREATE TABLE `TechStack` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_JobPostingToTechStack` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_JobPostingToTechStack_AB_unique`(`A`, `B`),
    INDEX `_JobPostingToTechStack_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_JobPostingToTechStack` ADD CONSTRAINT `_JobPostingToTechStack_A_fkey` FOREIGN KEY (`A`) REFERENCES `JobPosting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_JobPostingToTechStack` ADD CONSTRAINT `_JobPostingToTechStack_B_fkey` FOREIGN KEY (`B`) REFERENCES `TechStack`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
