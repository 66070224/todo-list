/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `_AssignedTo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_userId_fkey";

-- DropForeignKey
ALTER TABLE "_AssignedTo" DROP CONSTRAINT "_AssignedTo_A_fkey";

-- DropForeignKey
ALTER TABLE "_AssignedTo" DROP CONSTRAINT "_AssignedTo_B_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "assignUserId" TEXT;

-- DropTable
DROP TABLE "_AssignedTo";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignUserId_fkey" FOREIGN KEY ("assignUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
