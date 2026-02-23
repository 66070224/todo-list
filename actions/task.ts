"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { TaskCategory, TaskStatus } from "../app/generated/prisma/enums";

export async function createTask(
  title: string,
  category: TaskCategory,
  description?: string,
  assignUserId?: string,
) {
  const origin = process.env.URL || "http://localhost:3000";
  const URI = new URL("/api/tasks", origin);
  return fetch(URI, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      title,
      category,
      description,
      assignUserId,
    }),
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
