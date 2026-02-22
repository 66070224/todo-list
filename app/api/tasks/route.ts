import { TaskCategory, TaskStatus } from "@/app/generated/prisma/enums";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const title = searchParams.get("title");
  const categories = searchParams.get("categories");
  const statuses = searchParams.get("status");

  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
  const tasks = await prisma.task.findMany({
    where: {
      title: {
        contains: title ?? undefined,
      },
      category: {
        in: categories ? (categories.split(",") as TaskCategory[]) : undefined,
      },
      status: {
        in: statuses ? (statuses.split(",") as TaskStatus[]) : undefined,
      },
    },
  });
  return Response.json(tasks);
}

export async function POST(req: NextRequest) {
  const data: {
    title: string;
    category: TaskCategory;
    description?: string;
    assignUserId?: string;
  } = await req.json();
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
  await prisma.task.create({
    data: {
      userId: session.user.id,
      title: data.title,
      description: data.description,
      category: data.category,
      assignUserId: data.assignUserId,
    },
  });
  return new Response("Done");
}
