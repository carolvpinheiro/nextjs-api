"use client";

import { useEffect, useState } from "react";
import TaskCard from "../../components/TaskCard";
import { listTasks } from "../../lib/tasks";

export default function TasksPage() {
  const [tasks, setTasks] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTasks() {
      try {
        // read the saved session in the browser before calling the API
        const session = JSON.parse(sessionStorage.getItem("jamjar-session"));
        if (!session?.token) {
          throw new Error("Please sign in to view tasks.");
        }

        setTasks(await listTasks(session.token));
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Could not load tasks."
        );
      }
    }
    loadTasks();
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Tasks</h1>

      {error ? (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      ) : tasks === null ? (
        <p role="status">Loading tasks…</p>
      ) : tasks.length === 0 ? (
        <p className="text-slate-600">No tasks to display.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskCard task={task} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
