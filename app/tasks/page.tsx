import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import SiteHeader from "@/components/SiteHeader";
import { TasksTable } from "@/components/TasksTable";
import { prisma } from "@/prisma";
import { auth } from "@/auth";

export default async function TaskPage() {
  const session = await auth();
  if (!session?.user?.id) return;
  const data = await prisma.task.findMany({
    where: {
      userId: session?.user?.id,
    },
    include: {
      assignUser: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader header="Tasks" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <TasksTable data={data} userId={session.user.id} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
