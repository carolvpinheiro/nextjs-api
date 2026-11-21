"use client";

import { useState } from "react";
import ProjectCard from "./ProjectCard";
import ProjectForm from "./ProjectForm";

// recieve the initial projects via props
export default function ProjectList({ initialProjects }) {
  // use state to store and set all projects
  const [projects, setProjects] = useState(initialProjects);
  // use null when the form is closed and store the project when editing
  const [form, setForm] = useState(null);

  function handleSaveProject(values) {
    const editingProject = form.project;

    if (editingProject) {
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

  function handleDeleteProject(project) {
    const confirmed = window.confirm(`Delete "${project.name}"?`);
    if (!confirmed) return;
    // keep every project except the one selected for deletion
    setProjects((currentProjects) =>
      currentProjects.filter((item) => item.id !== project.id)
    );
    // close the edit form if it belongs to the deleted project
    setForm((currentForm) =>
      currentForm?.project?.id === project.id ? null : currentForm
    );
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
