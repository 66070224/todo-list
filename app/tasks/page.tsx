import NavBar from "@/components/navbar/NavBar";
import TaskSection from "@/components/TasksSection";
import { TaskCategory, TaskStatus } from "../generated/prisma/enums";

export default async function TaskPage() {
  return (
    <>
      <NavBar currentPage={2} />
      <main className="min-h-screen flex justify-center items-center flex-col px-100 gap-5">
        <h1 className="font-bold text-5xl">Your Tasks</h1>
        <div className="flex justify-end w-full">
          <button className="bg-foreground-light text-background-light py-1 px-2.5 rounded-2xl">
            <a href="/tasks/create">Create</a>
          </button>
        </div>
        <TaskSection />
      </main>
    </>
  );
}
