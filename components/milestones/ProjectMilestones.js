"use client";

import { useEffect, useState } from "react";
import {
  listProjectMilestones,
  updateMilestone,
  deleteMilestone,
  createMilestone,
} from "../../lib/milestones";
import MilestoneCard from "./MilestoneCard";
import MilestoneForm from "./MilestoneForm";

export default function ProjectMilestones({ projectId }) {
  const [milestones, setMilestones] = useState(null);
  const [error, setError] = useState("");
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [completingId, setCompletingId] = useState(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  async function handleSaveMilestone(values) {
    const session = JSON.parse(sessionStorage.getItem("jamjar-session"));

    if (!session?.token) {
      throw new Error("Please sign in to edit a milestone.");
    }
    await updateMilestone(
      editingMilestone.id,
      {
        ...values,
        project_id: projectId,
        completed_at: editingMilestone.completed_at ?? null,
      },
      session.token
    );

    // update only the selected milestone and preserve its completion status
    setMilestones((currentMilestones) =>
      currentMilestones.map((milestone) =>
        milestone.id === editingMilestone.id
          ? { ...milestone, ...values }
          : milestone
      )
    );
    setEditingMilestone(null);
  }

  async function handleDeleteMilestone(milestone) {
    if (deletingId || !window.confirm(`Delete "${milestone.title}"?`)) return;

    setError("");
    setDeletingId(milestone.id);

    try {
      const session = JSON.parse(sessionStorage.getItem("jamjar-session"));
      if (!session?.token) {
        throw new Error("Please sign in to delete a milestone.");
      }
      await deleteMilestone(milestone.id, session.token);

      // remove only the selected milestone after the API accepts the request
      setMilestones((currentMilestones) =>
        currentMilestones.filter((item) => item.id !== milestone.id)
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not delete the milestone."
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleCompleteMilestone(milestone) {
    if (completingId || deletingId || milestone.completed_at) return;

    setError("");
    setCompletingId(milestone.id);

    try {
      const session = JSON.parse(sessionStorage.getItem("jamjar-session"));
      if (!session?.token) {
        throw new Error("Please sign in to complete a milestone.");
      }

      // format the UTC timestamp as YYYY-MM-DD HH:mm:ss for the API
      const completedAt = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      await updateMilestone(
        milestone.id,
        {
          project_id: projectId,
          title: milestone.title,
          description: milestone.description ?? null,
          due_date: milestone.due_date ?? null,
          completed_at: completedAt,
        },
        session.token
      );

      // update only the selected card after the API accepts the request
      setMilestones((currentMilestones) =>
        currentMilestones.map((item) =>
          item.id === milestone.id
            ? { ...item, completed_at: completedAt }
            : item
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not complete the milestone."
      );
    } finally {
      setCompletingId(null);
    }
  }

  async function handleCreateMilestone(values) {
    const session = JSON.parse(sessionStorage.getItem("jamjar-session"));

    if (!session?.token) {
      throw new Error("Please sign in to create a milestone.");
    }
    setError("");
    await createMilestone(projectId, values, session.token);
    setIsCreateFormOpen(false);

    try {
      // reload the list to get the ID assigned by the API
      const items = await listProjectMilestones(projectId, session.token);
      setMilestones(items);
    } catch {
      // the POST already succeeded, so report the refresh failure separately
      setError(
        "Milestone request accepted, but the list could not be refreshed. Reload the page to check it."
      );
    }
  }

  useEffect(() => {
    let ignore = false;

    async function loadMilestones() {
      try {
        const session = JSON.parse(sessionStorage.getItem("jamjar-session"));

        if (!session?.token) {
          throw new Error("Please sign in to view milestones.");
        }

        const items = await listProjectMilestones(projectId, session.token);

        if (!ignore) setMilestones(items);
      } catch (error) {
        if (!ignore) {
          setError(
            error instanceof Error
              ? error.message
              : "Could not load milestones."
          );
        }
      }
    }

    loadMilestones();

    // ignore late responses after leaving the tab or switching projects
    return () => {
      ignore = true;
    };
  }, [projectId]);

  if (error && milestones === null) {
    return (
      <p role="alert" className="text-red-700">
        {error}
      </p>
    );
  }

  if (milestones === null) {
    return <p role="status">Loading milestones…</p>;
  }

  return (
    <>
      {error && (
        <p role="alert" className="mb-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {isCreateFormOpen ? (
        <MilestoneForm
          onSave={handleCreateMilestone}
          onCancel={() => setIsCreateFormOpen(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setEditingMilestone(null);
            setIsCreateFormOpen(true);
          }}
          className="rounded-lg bg-[#21665E] px-4 py-2 font-medium text-white hover:bg-[#174C48]"
        >
          + New milestone
        </button>
      )}

      {milestones.length === 0 ? (
        <p className="text-slate-600">This project has no milestones yet.</p>
      ) : (
        <ul className="space-y-2">
          {milestones.map((milestone) => (
            <li key={milestone.id}>
              {editingMilestone?.id === milestone.id ? (
                <MilestoneForm
                  milestone={milestone}
                  onSave={handleSaveMilestone}
                  onCancel={() => setEditingMilestone(null)}
                />
              ) : (
                <MilestoneCard
                  milestone={milestone}
                  onEdit={(selectedMilestone) => {
                    setIsCreateFormOpen(false);
                    setEditingMilestone(selectedMilestone);
                  }}
                  onDelete={handleDeleteMilestone}
                  isDeleting={deletingId === milestone.id}
                  onComplete={handleCompleteMilestone}
                  isCompleting={completingId === milestone.id}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
