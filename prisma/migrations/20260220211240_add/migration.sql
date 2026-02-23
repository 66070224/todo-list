-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'PROGRESS', 'COMPLETED', 'BREAK');

-- CreateEnum
CREATE TYPE "TaskCategory" AS ENUM ('WORK', 'PERSONAL', 'STUDY', 'FAMILY', 'FINANCE', 'HEALTH');

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "category" "TaskCategory" NOT NULL,
    "assignUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignUserId_fkey" FOREIGN KEY ("assignUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
