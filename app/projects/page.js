import { listProjects } from "../../lib/projects";

export default async function ProjectsPage() {
  // use the list created in the lib using await
  const projects = await listProjects();

  return (
    <section
      aria-labelledby="projects-heading"
      className="mx-auto max-w-6xl px-4 py-8 sm:px-6"
    >
      <h1
        id="projects-heading"
        className="mb-6 text-3xl font-bold text-slate-900"
      >
        Projects
      </h1>

      {projects.length === 0 ? (
        <p className="rounded-lg border border-slate-200 p-5 text-slate-600">
          No projects to display.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li
              key={project.id}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h2 className="break-words text-lg font-semibold text-slate-900">
                {project.name}
              </h2>
              <p className="mt-2 break-words text-sm text-slate-600">
                {project.description?.trim() || "No description provided."}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
