"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTask } from "../../../lib/tasks";

const taskStatuses = {
  todo: { label: "To do", colors: "bg-[#EDE4F3] text-[#573866]" },
  in_progress: {
    label: "In progress",
    colors: "bg-[#FEF3C7] text-[#78350F]",
  },
  done: { label: "Done", colors: "bg-[#DDF1EB] text-[#174C48]" },
};

export default function TaskDetailsPage() {
  // get the task ID from the current URL using useParams (Next.js hook)
  // store the task returned by the API, use null while it loads
  // store the error message to display if the request fails
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // clear the previous task and error before loading the current task
    setTask(null);
    setError("");

    async function loadTask() {
      try {
        // read the token stored during login
        const storedSession = sessionStorage.getItem("jamjar-session");
        const token = storedSession ? JSON.parse(storedSession)?.token : null;
        if (!token) {
          throw new Error("Please sign in to view this task.");
        }

        const loadedTask = await getTask(taskId, token);
        setTask(loadedTask);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Could not load the task."
        );
      }
    }
    loadTask();
  }, [taskId]);

  // use the projects list as a fallback while the task is loading
  const projectId = task?.project?.id;
  const backHref = projectId
    ? `/projects/${encodeURIComponent(projectId)}`
    : "/projects";

  const status = taskStatuses[task?.status];

  return (
    <section className="space-y-4">
      <Link href={backHref} className="font-medium text-[#21665E] underline">
        {projectId ? "← Back to project" : "← Back to projects"}
      </Link>

      {error ? (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      ) : task === null ? (
        <p role="status">Loading task…</p>
      ) : (
        <article className="space-y-5 rounded-xl border border-[#E9E1E7] bg-white p-6 shadow-sm">
          <header className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="min-w-0 break-words text-2xl font-bold">
              {task.name}
            </h1>

            <span
              className={`rounded-full px-2.5 py-1 text-sm font-medium ${
                status?.colors ?? "bg-slate-100 text-slate-700"
              }`}
            >
              {status?.label ?? task.status}
            </span>
          </header>

          <p className="whitespace-pre-wrap break-words text-slate-600">
            {task.description || "No description provided."}
          </p>

          <dl className="grid gap-4 border-t border-[#E9E1E7] pt-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-semibold">Project</dt>
              <dd>{task.project?.name ?? "Project unavailable"}</dd>
            </div>

            <div>
              <dt className="text-sm font-semibold">Assignee</dt>
              <dd>{task.assigned_to?.name ?? "Unassigned"}</dd>
            </div>

            <div>
              <dt className="text-sm font-semibold">Due date</dt>
              <dd>{task.due_date || "No due date"}</dd>
            </div>

            <div>
              <dt className="text-sm font-semibold">Created</dt>
              <dd>{task.created?.human ?? "Not available"}</dd>
            </div>
          </dl>
        </article>
      )}
    </section>
  );
}
