"use client";

import { useState } from "react";
import ProjectCard from "./ProjectCard";
import ProjectForm from "./ProjectForm";
import { updateProject, deleteProject } from "../lib/projects";

// recieve the initial projects via props
export default function ProjectList({ initialProjects }) {
  // use state to store and set all projects
  const [projects, setProjects] = useState(initialProjects);
  // use null when the form is closed and store the project when editing
  const [form, setForm] = useState(null);
  // store the error message to display if a project cannot be deleted
  const [deleteError, setDeleteError] = useState("");

  async function handleSaveProject(values) {
    const editingProject = form.project;

    if (editingProject) {
      // use the session saved by the login page to authenticate the update
      const session = JSON.parse(sessionStorage.getItem("jamjar-session"));
      if (!session?.token) {
        throw new Error("Please sign in to edit this project.");
      }
      // send the edited values to the API with the project ID and session token,
      // wait for the update to succeed before changing the project card
      await updateProject(editingProject.id, values, session.token);

      // update the selected project and preserve its existing fields
      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === editingProject.id ? { ...project, ...values } : project
        )
      );
    } else {
      // generate a temporary ID until the API provides one
      const randomId = crypto.getRandomValues(new Uint32Array(4)).join("-");
      const newProject = { ...values, id: `mock-${randomId}` };

      setProjects((currentProjects) => [newProject, ...currentProjects]);
    }

    setForm(null);
  }

  async function handleDeleteProject(project) {
    if (!window.confirm(`Delete "${project.name}"?`)) return;
    setDeleteError("");

    try {
      // only call the API for projects that already exist in Laravel
      if (!String(project.id).startsWith("mock-")) {
        const session = JSON.parse(sessionStorage.getItem("jamjar-session"));
        if (!session?.token) {
          throw new Error("Please sign in to delete this project.");
        }

        await deleteProject(project.id, session.token);
      }

      // remove the card after the API confirms the deletion.
      setProjects((currentProjects) =>
        currentProjects.filter((item) => item.id !== project.id)
      );

      setForm((currentForm) =>
        currentForm?.project?.id === project.id ? null : currentForm
      );
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Could not delete project."
      );
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setForm({ project: null })}
        className="mb-4 rounded-lg bg-[#21665E] px-4 py-2 font-medium text-white hover:bg-[#174C48] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21665E]"
      >
        + New project
      </button>
      {form && (
        <div className="mb-6">
          {/* reset the form fields when I select a different project */}
          <ProjectForm
            key={form.project?.id ?? "new-project"}
            project={form.project}
            onSave={handleSaveProject}
            onCancel={() => setForm(null)}
          />
        </div>
      )}

      {/* check if have project and display a message if do not have or display all projects by ProjectCard component */}
      {projects.length === 0 ? (
        <p className="rounded-lg border border-slate-200 p-5 text-slate-600">
          No projects to display.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id}>
              {deleteError && (
                <p role="alert" className="mb-4 text-sm text-red-700">
                  {deleteError}
                </p>
              )}
              {/* recieve the project and set form method via props */}
              <ProjectCard
                project={project}
                onEdit={(selectedProject) =>
                  setForm({ project: selectedProject })
                }
                onDelete={handleDeleteProject}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
