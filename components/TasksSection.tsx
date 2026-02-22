"use client";

import { TaskCategory, TaskStatus } from "@/app/generated/prisma/enums";
import { useEffect, useState } from "react";
import SearchTaskSection from "./SearchTask";
type Tasks = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  category: TaskCategory;
  assignUserId: string | null;
};

export default function TaskSection() {
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [statuses, setStatuses] = useState<TaskStatus[]>([]);
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getTasks() {
      setError("");
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const URI = new URL("/api/tasks", origin);
      if (title) URI.searchParams.set("title", title);
      if (categories.length !== 0)
        URI.searchParams.set("categories", JSON.stringify(categories));
      if (statuses.length !== 0)
        URI.searchParams.set("status", JSON.stringify(status));
      const response = await fetch(URI, {
        method: "GET",
      });
      if (!response.ok) return setError("Error while fetching tasks");
      const data: Tasks[] = await response.json();
      setTasks(data);
    }

    getTasks();
  }, [title, categories, status]);
  return (
    <section className="bg-background-light text-foreground-light p-5 rounded-2xl shadow-2xl sm:w-full">
      <SearchTaskSection title={title} setTitle={setTitle} />
      <div className="min-h-80">
        {tasks !== undefined && tasks.length !== 0 ? (
          tasks.map((task) => <div key={task.id}>{task.title}</div>)
        ) : (
          <button>Create</button>
        )}
      </div>
    </section>
  );
}
