/*
  Warnings:

  - You are about to drop the column `assignUserId` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_assignUserId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "assignUserId";

-- CreateTable
CREATE TABLE "_AssignedTo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AssignedTo_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AssignedTo_B_index" ON "_AssignedTo"("B");

-- AddForeignKey
ALTER TABLE "_AssignedTo" ADD CONSTRAINT "_AssignedTo_A_fkey" FOREIGN KEY ("A") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssignedTo" ADD CONSTRAINT "_AssignedTo_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
