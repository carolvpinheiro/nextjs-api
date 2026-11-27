"use client";

import { useEffect, useState } from "react";
import {
  listProjectMilestones,
  updateMilestone,
  deleteMilestone,
} from "../../lib/milestones";
import MilestoneCard from "./MilestoneCard";
import MilestoneForm from "./MilestoneForm";

export default function ProjectMilestones({ projectId }) {
  const [milestones, setMilestones] = useState(null);
  const [error, setError] = useState("");
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

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

  if (milestones.length === 0) {
    return (
      <p className="text-slate-600">This project has no milestones yet.</p>
    );
  }

  return (
    <>
      {error && (
        <p role="alert" className="mb-3 text-sm text-red-700">
          {error}
        </p>
      )}
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
                onEdit={setEditingMilestone}
                onDelete={handleDeleteMilestone}
                isDeleting={deletingId === milestone.id}
              />
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
