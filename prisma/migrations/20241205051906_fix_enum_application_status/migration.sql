/*
  Warnings:

  - The values [CANCLED] on the enum `Application_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Application` MODIFY `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELED') NOT NULL;
