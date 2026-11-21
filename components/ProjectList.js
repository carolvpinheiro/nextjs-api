"use client";

import { useState } from "react";
import ProjectCard from "./ProjectCard";
import ProjectForm from "./ProjectForm";

// recieve the initial projects via props
export default function ProjectList({ initialProjects }) {
  // use state to store and set all projects
  const [projects, setProjects] = useState(initialProjects);
  // use state to check the project edition
  const [editingProject, setEditingProject] = useState(null);

  function handleSaveProject(values) {
    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        // update only the project whose ID matches the one being edited nd keep its existing fields
        project.id === editingProject.id ? { ...project, ...values } : project
      )
    );
    // reset editingProject state
    setEditingProject(null);
  }

  return (
    <>
      {editingProject && (
        <div className="mb-6">
          {/* reset the form fields when I select a different project */}
          <ProjectForm
            key={editingProject.id}
            project={editingProject}
            onSave={handleSaveProject}
            onCancel={() => setEditingProject(null)}
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
              {/* recieve the project and the editin project method via props */}
              <ProjectCard project={project} onEdit={setEditingProject} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
