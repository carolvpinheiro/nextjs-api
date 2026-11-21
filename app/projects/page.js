"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProjectList from "../../components/ProjectList";
import { listProjects } from "../../lib/projects";

export default function ProjectsPage() {
  const [projects, setProjects] = useState(null);
  const [needsSignIn, setNeedsSignIn] = useState(false);
  const [error, setError] = useState("");

  // use useEffect to read the saved session and fetch projects after
  // the component mounts, when sessionStorage is available in the browser
  useEffect(() => {
    async function loadProjects() {
      try {
        // read the token saved by the login page
        const session = JSON.parse(sessionStorage.getItem("jamjar-session"));
        // check if the user is authenticated
        if (!session?.token) {
          setNeedsSignIn(true);
          return;
        }
        // pass the token to the listProjects lib via parameters
        const loadedProjects = await listProjects(session.token);
        setProjects(loadedProjects);
      } catch (error) {
        setError(error.message);
      }
    }

    loadProjects();
  }, []);

  return (
    <section aria-labelledby="projects-heading">
      <h1
        id="projects-heading"
        className="mb-6 text-3xl font-bold text-slate-900"
      >
        Projects
      </h1>

      {(needsSignIn || error) && (
        <div className="space-y-2">
          {error && (
            <p role="alert" className="text-red-700">
              {error}
            </p>
          )}
          <Link
            href="/login"
            className="font-semibold text-[#21665E] underline"
          >
            Go to sign in
          </Link>
        </div>
      )}
      {/* pass projectivs to ProjectList via prop after verify authentication, errors and if have projects */}
      {!needsSignIn &&
        !error &&
        (projects === null ? (
          <p role="status">Loading projects…</p>
        ) : (
          <ProjectList initialProjects={projects} />
        ))}
    </section>
  );
}
