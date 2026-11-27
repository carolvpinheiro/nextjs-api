"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getProject } from "../../../lib/projects";
import ProjectTabs from "../../../components/projects/ProjecTabs";

export default function ProjectDetailsPage() {
  // read the project ID from the [id] segment of the current URL
  const { id } = useParams();

  // store the loaded project and any error I need to show on the page
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");

  // load the project after the page mounts in the browser and whenever the ID changes
  useEffect(() => {
    // ignore used to prevent an old request from updating the page after the project ID changes
    let ignore = false;

    async function loadProject() {
      // clear the previous project and error before starting a new request
      setProject(null);
      setError("");

      try {
        // read the session saved by the login page and parse it from JSON
        const session = JSON.parse(sessionStorage.getItem("jamjar-session"));

        // stop before calling the API if the session has no token
        if (!session?.token) {
          throw new Error("Please sign in to view this project.");
        }

        // pass the URL's project ID and the saved token to the API function
        const loadedProject = await getProject(id, session.token);

        // update the page only if this request still belongs to the current effect
        if (!ignore) setProject(loadedProject);
      } catch (error) {
        // show errors only from the current request
        if (!ignore) setError(error.message);
      }
    }

    loadProject();

    // ignore late responses if the user leaves the page or opens another project
    // the request can still finish, but its result will be ignored
    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <section className="space-y-4">
      <Link href="/projects" className="font-medium text-[#21665E] underline">
        ← Back to projects
      </Link>

      {/* announce any error that prevents the project from loading */}
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}

      {/* show the loading message while there is no project or error to display */}
      {!error && !project && <p role="status">Loading project…</p>}

      {/* how the project tabs with the project details once the data is available */}
      {project && (
        <article className="min-w-0 space-y-4 rounded-xl border border-[#E9E1E7] bg-white p-6 shadow-sm">
          <h1 className="break-words text-2xl font-bold">{project.name}</h1>

          <ProjectTabs
            key={id}
            projectId={id}
            description={project.description}
          />
        </article>
      )}
    </section>
  );
}
