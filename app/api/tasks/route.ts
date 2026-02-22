"use server";

import { TaskCategory } from "@/app/generated/prisma/enums";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("GET tasks");
  const session = await auth();
  console.log(session?.user?.id);
  if (!session?.user?.id)
    return NextResponse.json({ message: "Missing user's id" }, { status: 401 });
  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      assignUser: {
        select: {
          name: true,
        },
      },
    },
  });
  return NextResponse.json({ message: "Done", tasks }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const data: {
    title: string;
    category: TaskCategory;
    description?: string;
    assignUserId?: string;
  } = await req.json();
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ message: "Missing user's id" }, { status: 401 });
  const task = await prisma.task.create({
    data: {
      userId: session.user.id,
      title: data.title,
      description: data.description,
      category: data.category,
      assignUserId: data.assignUserId,
    },
  });

  return NextResponse.json({ message: "Done", task }, { status: 200 });
}
