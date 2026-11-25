"use client";

import { useEffect, useState, useRef } from "react";
import { listProjectTasks, createTask, updateTask } from "../lib/tasks";
import { listUsers } from "../lib/users";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";

// read the login token after the component mounts in the browser
function getSessionToken() {
  const storedSession = sessionStorage.getItem("jamjar-session");
  return storedSession ? JSON.parse(storedSession)?.token : null;
}

export default function ProjectTasks({ projectId }) {
  const [tasks, setTasks] = useState(null);
  const [error, setError] = useState("");

  // use null when the form is closed and store the selected task when editing
  const [form, setForm] = useState(null);
  const [createNotice, setCreateNotice] = useState("");

  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState("");

  // use the useRef from react to scroll to TaskForm component
  const formRef = useRef(null);
  useEffect(() => {
    if (!form?.task) return;
    // scroll to the edit form after it has rendered
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [form]);

  async function handleSaveTask(values) {
    const editingTask = form.task;
    const token = getSessionToken();

    if (!token) {
      throw new Error("Please sign in to save a task.");
    }

    setCreateNotice("");

    if (editingTask) {
      // wait for the API to accept the update before changing the selected card
      await updateTask(editingTask.id, projectId, values, token);

      // the form submits an assignee ID, but task details use an assignee object
      const assignee = values.assigned_to
        ? users.find((user) => user.id === values.assigned_to) ??
          editingTask.assigned_to
        : null;

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTask.id
            ? { ...task, ...values, assigned_to: assignee }
            : task
        )
      );

      setForm(null);
      return;
    }

    await createTask(projectId, values, token);
    setForm(null);

    try {
      // reload the task list after the API accepts the new task to get its ID
      const loadedTasks = await listProjectTasks(projectId, token);
      setTasks(loadedTasks);
      setError("");
      setCreateNotice(
        "Task request accepted. Refresh if it is not listed yet."
      );
    } catch {
      // the POST already succeeded, so report the refresh failure separately
      setCreateNotice(
        "Task request accepted, but the list could not be refreshed."
      );
    }
  }

  async function handleOpenTaskForm(task = null) {
    setForm({ task });
    setUsersError("");
    setIsLoadingUsers(true);

    try {
      const token = getSessionToken();

      if (!token) {
        throw new Error("Please sign in to load assignees.");
      }

      // load the users when the task form opens
      setUsers(await listUsers(token));
    } catch (error) {
      setUsers([]);
      setUsersError(
        error instanceof Error ? error.message : "Could not load assignees."
      );
    } finally {
      setIsLoadingUsers(false);
    }
  }

  useEffect(() => {
    let ignore = false;

    async function loadTasks() {
      try {
        const token = getSessionToken();

        if (!token) {
          throw new Error("Please sign in to view project tasks.");
        }

        const loadedTasks = await listProjectTasks(projectId, token);

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

      {createNotice && (
        <p role="status" className="text-sm text-[#21665E]">
          {createNotice}
        </p>
      )}

      <button
        type="button"
        onClick={() => handleOpenTaskForm()}
        className="rounded-lg bg-[#21665E] px-4 py-2 font-medium text-white hover:bg-[#174C48]"
      >
        + New task
      </button>

      {form && (
        <div ref={formRef} className="scroll-mt-6">
          {/* reset the form fields when a different task is selected */}
          <TaskForm
            key={form.task?.id ?? "new-task"}
            task={form.task}
            onSave={handleSaveTask}
            onCancel={() => setForm(null)}
            users={users}
            isLoadingUsers={isLoadingUsers}
            usersError={usersError}
          />
        </div>
      )}

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
            <li key={task.id}>
              <TaskCard task={task} onEdit={handleOpenTaskForm} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
