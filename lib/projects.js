import projects from "../mocks/projects.json";

// creat an async function to list projects so I can use await when I connect the Laravel API
export async function listProjects() {
  return projects;
}
