"use client";

import { useEffect, useState } from "react";
import { listProjectTasks } from "../lib/tasks";

export default function ProjectTasks({ projectId }) {
  const [tasks, setTasks] = useState(null);
  const [error, setError] = useState("");

  // give each task status its own label and badge colors
  const taskStatuses = {
    todo: { label: "To do", colors: "bg-[#EDE4F3] text-[#573866]" },
    in_progress: {
      label: "In progress",
      colors: "bg-[#FEF3C7] text-[#78350F]",
    },
    done: { label: "Done", colors: "bg-[#DDF1EB] text-[#174C48]" },
  };

  useEffect(() => {
    let ignore = false;

    async function loadTasks() {
      try {
        // read the login token after the component mounts in the browser
        const session = JSON.parse(sessionStorage.getItem("jamjar-session"));

        if (!session?.token) {
          throw new Error("Please sign in to view project tasks.");
        }
        const loadedTasks = await listProjectTasks(projectId, session.token);

        if (!ignore) setTasks(loadedTasks);
      } catch (error) {
        if (!ignore) setError(error.message);
      }
    }

    loadTasks();

    // ignore the response if the user leaves before the request finishes
    return () => {
      ignore = true;
    };
  }, [projectId]);

  return (
    <section aria-labelledby="project-tasks-heading" className="space-y-3">
      <h2 id="project-tasks-heading" className="text-xl font-bold">
        Tasks
      </h2>

      {error ? (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      ) : tasks === null ? (
        <p role="status">Loading tasks…</p>
      ) : tasks.length === 0 ? (
        <p className="text-slate-600">This project has no tasks yet.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#E9E1E7] bg-white px-4 py-3"
            >
              <span className="font-medium">{task.name}</span>
              <span
                className={`rounded-full px-2.5 py-1 text-sm font-medium ${
                  taskStatuses[task.status]?.colors ??
                  "bg-slate-100 text-slate-700"
                }`}
              >
                {taskStatuses[task.status]?.label ?? task.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
