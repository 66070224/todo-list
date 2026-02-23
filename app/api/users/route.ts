import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ message: "Missing user's id" }, { status: 401 });
  const users = await prisma.user.findMany({
    where: {
      id: { not: session.user.id },
    },
  });

  return NextResponse.json({ message: "Done", users });
}
