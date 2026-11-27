import { useState } from "react";

// receive both callbacks from the parent component ProjectTasks
// call onSave with the task name and status so ProjectTasks can send them to the API
// call onCancel when the user clicks Cancel so ProjectTasks can close the form
export default function TaskForm({
  onSave,
  onCancel,
  users = [],
  task = null,
  isLoadingUsers = false,
  usersError = "",
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  // const [task, setTask] = useState(null);

  const isEditing = Boolean(task);
  // convert date format into YYYY-MM-DD to fill the input
  const dueDate = task?.due_date ?? "";
  const inputDueDate = /^\d{2}-\d{2}-\d{4}$/.test(dueDate)
    ? dueDate.split("-").reverse().join("-")
    : dueDate.slice(0, 10);

  async function handleSubmit(event) {
    event.preventDefault();

    // read the current values using the name attribute of each field
    const fields = new FormData(event.currentTarget);
    const name = fields.get("name").trim();
    const status = fields.get("status");

    // reject names made up only of spaces, which can pass the required check
    if (!name) {
      setError("Enter a task name.");
      return;
    }

    // clear the previous error and disable the form while saving
    setError("");
    setIsSaving(true);

    try {
      // pass the form values to ProjectTasks, which handles the API request
      await onSave({
        name,
        status,
        description: fields.get("description").trim() || null,
        due_date: fields.get("due_date").split("-").reverse().join("-") || null,
        assigned_to: fields.get("assigned_to") || null,
      });
    } catch (error) {
      // show the save error so the user can correct the form and try again
      setError(
        error instanceof Error ? error.message : "Could not save the task."
      );
    } finally {
      // clear the saving state whether the request succeeds or fails
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-[#E9E1E7] bg-white p-5"
    >
      <fieldset disabled={isSaving} className="space-y-4">
        <legend className="mb-3 font-bold">
          {isEditing ? "Edit task" : "New task"}
        </legend>

        <label className="block text-sm font-medium">
          Task name
          <input
            name="name"
            required
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
            defaultValue={task?.name ?? ""}
          />
        </label>

        <label className="block text-sm font-medium">
          Status
          <select
            name="status"
            defaultValue={task?.status ?? "todo"}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>

        <label className="block text-sm font-medium">
          Description (optional)
          <textarea
            name="description"
            rows={3}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
            defaultValue={task?.description ?? ""}
          />
        </label>

        <label className="block text-sm font-medium">
          Due date (optional)
          <input
            type="date"
            name="due_date"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
            defaultValue={inputDueDate}
          />
        </label>

        <label className="block text-sm font-medium">
          Assignee (optional)
          <select
            name="assigned_to"
            defaultValue={task?.assigned_to?.id ?? ""}
            disabled={isLoadingUsers || Boolean(usersError)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">
              {isLoadingUsers ? "Loading users…" : "Unassigned"}
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </label>

        {usersError && (
          <p role="alert" className="text-sm text-red-700">
            {usersError} You can still create an unassigned task.
          </p>
        )}

        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-lg bg-[#21665E] px-4 py-2 font-medium text-white disabled:opacity-60"
          >
            {isSaving ? "Saving…" : isEditing ? "Save changes" : "Create task"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </fieldset>
    </form>
  );
}
