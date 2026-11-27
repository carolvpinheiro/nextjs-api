import { useState } from "react";

const fieldClass =
  "mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2";

export default function MilestoneForm({ milestone, onSave, onCancel }) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const fields = new FormData(event.currentTarget);
    const title = fields.get("title").trim();

    if (!title) {
      setError("Enter a milestone title.");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      await onSave({
        title,
        description: fields.get("description").trim() || null,
        due_date: fields.get("due_date") || null,
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not save the milestone."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-[#E9E1E7] bg-white p-5"
    >
      <fieldset disabled={isSaving} className="space-y-4">
        <legend className="mb-3 font-bold">Edit milestone</legend>

        <label className="block text-sm font-medium">
          Title
          <input
            name="title"
            defaultValue={milestone.title}
            required
            className={fieldClass}
          />
        </label>

        <label className="block text-sm font-medium">
          Description (optional)
          <textarea
            name="description"
            defaultValue={milestone.description ?? ""}
            rows={3}
            className={fieldClass}
          />
        </label>

        <label className="block text-sm font-medium">
          Due date
          <input
            type="date"
            name="due_date"
            defaultValue={milestone.due_date ?? ""}
            className={fieldClass}
          />
        </label>

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
            {isSaving ? "Saving…" : "Save changes"}
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
