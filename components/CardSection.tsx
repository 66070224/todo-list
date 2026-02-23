import { auth } from "@/auth";
import { prisma } from "@/prisma";
import AllTasksPieChart from "./AllTasksPieChart";
import CategoryPieChart from "./CategoryPieChar";
import { TaskCategory } from "@/app/generated/prisma/enums";

export default async function CardSection() {
  const session = await auth();
  if (!session?.user?.id) return;

  const allCategoryTasks = await prisma.task.groupBy({
    by: ["category"],
    where: {
      userId: session.user.id,
    },
    _count: {
      _all: true,
    },
  });

  const allStatusTasks = async (userId: string, category: TaskCategory) =>
    await prisma.task.groupBy({
      by: ["category", "status"],
      where: {
        userId,
        category,
      },
      _count: {
        _all: true,
      },
    });

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* ALL */}
      <AllTasksPieChart data={allCategoryTasks} />
      <CategoryPieChart
        data={await allStatusTasks(session.user.id, "PERSONAL")}
        category="Personal"
      />
      <CategoryPieChart
        data={await allStatusTasks(session.user.id, "FAMILY")}
        category="Family"
      />
      <CategoryPieChart
        data={await allStatusTasks(session.user.id, "STUDY")}
        category="Study"
      />
      <CategoryPieChart
        data={await allStatusTasks(session.user.id, "WORK")}
        category="Work"
      />
      <CategoryPieChart
        data={await allStatusTasks(session.user.id, "HEALTH")}
        category="Health"
      />
      <CategoryPieChart
        data={await allStatusTasks(session.user.id, "FINANCE")}
        category="Finance"
      />
    </div>
  );
}
