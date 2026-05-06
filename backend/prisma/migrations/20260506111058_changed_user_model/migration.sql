/*
  Warnings:

  - You are about to alter the column `fullname` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `fullname` VARCHAR(100) NOT NULL,
    MODIFY `password` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);
