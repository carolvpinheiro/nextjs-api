"use client";

import { useState } from "react";

// recive via props the editingProject, handleSaveProject and setEditingProject to null on cancel
export default function ProjectForm({ project, onSave, onCancel }) {
  // use to check if is a editing or a creating project
  const isEditing = Boolean(project);

  // start with empty fields for a new project and prefill them when editing
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();
    // validate if the project name is filled
    if (!trimmedName) {
      setError("Enter a project name.");
      return;
    }

    setIsSaving(true);

    try {
      // let the page decide how to save the project
      await onSave({
        // pass the new values to the handleSaveProject method
        name: trimmedName,
        description: description.trim(),
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not save the project."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl space-y-4 rounded-xl border border-[#E9E1E7] bg-white p-5 shadow-sm"
    >
      <h2 className="text-xl font-semibold">
        {isEditing ? "Edit project" : "Create project"}
      </h2>

      <fieldset disabled={isSaving} className="space-y-4">
        <label className="block text-sm font-medium">
          Project name
          <input
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="block text-sm font-medium">
          Description <span className="font-normal">(optional)</span>
          <textarea
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-lg bg-[#21665E] px-4 py-2 font-medium text-white hover:bg-[#174C48] disabled:opacity-60"
          >
            {isSaving
              ? "Saving…"
              : isEditing
              ? "Save changes"
              : "Create project"}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-300 px-4 py-2"
            >
              Cancel
            </button>
          )}
        </div>
      </fieldset>
    </form>
  );
}
