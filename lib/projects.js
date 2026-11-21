// read the API base URL from .env.local and remove any trailing slashes
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

// receives the token as a parameter
export async function listProjects(token) {
  // check the API URL before sending the request
  if (!API_URL) {
    throw new Error("The API URL is missing from the app configuration.");
  }
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  // sent GET request to projects with the bearer token and a json response
  const response = await fetch(`${API_URL}/projects`, { headers });

  // deal with unauthorized response
  if (response.status === 401) {
    throw new Error("Please sign in again to view your projects.");
  }

  //await waits for the HTTP response to become available
  // still report the HTTP status if the response body is not JSON
  const result = await response.json().catch(() => null);

  // deal with response errors
  if (!response.ok) {
    throw new Error(
      result?.message || `Could not load projects (${response.status}).`
    );
  }

  // accept a plain array or a list wrapped in the data field
  const projects = result?.data ?? result;

  // deal with unexpected projects response
  if (!Array.isArray(projects)) {
    throw new Error("The API returned an unexpected projects response.");
  }

  return projects;
}
