import { auth } from "@/auth";
import { prisma } from "@/prisma";
import AllTasksPieChart from "./AllTasksPieChart";
import CategoryPieChart from "./CategoryPieChar";
import { TaskCategory } from "@/app/generated/prisma/enums";
import { Button } from "./ui/button";
import Link from "next/link";

export default async function CardSection() {
  const session = await auth();
  if (!session?.user?.id) return;

  const grouped = await prisma.task.groupBy({
    by: ["category", "status"],
    where: {
      userId: session.user.id,
    },
    _count: {
      _all: true,
    },
  });

  const categorySummary = await prisma.task.groupBy({
    by: ["category"],
    where: {
      userId: session.user.id,
    },
    _count: {
      _all: true,
    },
  });

  const byCategory = grouped.reduce(
    (acc, curr) => {
      if (!acc[curr.category]) acc[curr.category] = [];
      acc[curr.category].push(curr);
      return acc;
    },
    {} as Record<string, typeof grouped>,
  );

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {grouped.length !== 0 ? (
        <>
          <AllTasksPieChart data={categorySummary} />
          {Object.entries(byCategory).map(([category, data]) => (
            <CategoryPieChart key={category} data={data} category={category} />
          ))}{" "}
        </>
      ) : (
        <div>
          <Button asChild>
            <Link href={"/tasks"}>At your first task</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
