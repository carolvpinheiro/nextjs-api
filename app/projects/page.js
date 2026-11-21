import ProjectList from "../../components/ProjectList";
import { listProjects } from "../../lib/projects";

export default async function ProjectsPage() {
  // use the list created in the lib using await
  const projects = await listProjects();

  return (
    <section aria-labelledby="projects-heading">
      <h1
        id="projects-heading"
        className="mb-6 text-3xl font-bold text-slate-900"
      >
        Projects
      </h1>
      {/* pass projectivs to ProjectList via prop */}
      <ProjectList initialProjects={projects} />
    </section>
  );
}
