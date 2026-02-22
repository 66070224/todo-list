"use server";

import { TaskCategory } from "@/app/generated/prisma/enums";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params;
  console.log(taskId);
  if (!taskId)
    return NextResponse.json({ message: "Missing task's id" }, { status: 400 });

  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ message: "Missing user's id" }, { status: 401 });

  const data: {
    title: string;
    category: TaskCategory;
    description?: string;
    assignUserId?: string;
  } = await req.json();

  const task = await prisma.task.update({
    where: {
      id: taskId,
      userId: session.user.id,
    },
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      assignUserId: data.assignUserId,
    },
  });
  return NextResponse.json({ message: "Done", task }, { status: 200 });
}
