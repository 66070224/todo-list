"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { TaskCategory, TaskStatus } from "../generated/prisma/enums";

export async function createTask(
  title: string,
  category: TaskCategory,
  description?: string,
  assignUserId?: string,
) {
  const session = await auth();
  if (!session?.user?.id) return;
  await prisma.task.create({
    data: {
      userId: session.user.id,
      title: title,
      description: description,
      category: category,
      assignUserId: assignUserId,
    },
  });
}

export async function getTasks(
  title?: string,
  categories?: TaskCategory[],
  status?: TaskStatus[],
) {
  const session = await auth();
  if (!session?.user?.id) return;
  return prisma.task.findMany({
    where: {
      title: {
        contains: title,
      },
      category: {
        in: categories,
      },
      status: {
        in: status,
      },
    },
  });
}
