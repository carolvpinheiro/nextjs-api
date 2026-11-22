// read the API base URL from .env.local and remove any trailing slashes
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

// build the headers for project requests, including the bearer token
function getProjectHeaders(token) {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  return headers;
}

// receives the token as a parameter
export async function listProjects(token) {
  // check the API URL before sending the request
  if (!API_URL) {
    throw new Error("The API URL is missing from the app configuration.");
  }
  const headers = getProjectHeaders(token);
  // sent GET request to projects
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

// receives the token and the id as a parameter
export async function getProject(id, token) {
  if (!API_URL) {
    throw new Error("The API URL is missing from the app configuration.");
  }
  const headers = getProjectHeaders(token);
  // request a single project using the ID from the URL
  const response = await fetch(
    `${API_URL}/projects/${encodeURIComponent(id)}`,
    { headers }
  );

  if (response.status === 404) {
    throw new Error("Project not found.");
  }
  if (response.status === 401) {
    throw new Error("Please sign in again to view this project.");
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || `Could not load project (${response.status}).`
    );
  }

  const project = result?.data ?? result;

  if (typeof project?.name !== "string") {
    throw new Error("The API returned an unexpected project response.");
  }

  return project;
}

// receives the token, id and the values for edition as a parameter
export async function updateProject(id, values, token) {
  if (!API_URL) {
    throw new Error("The API URL is missing from the app configuration.");
  }

  const headers = {
    ...getProjectHeaders(token),
    // tell Laravel to parse the request body as JSON so it can validate the project fields
    "Content-Type": "application/json",
  };

  // reuse the bearer token headers and send the updated fields as JSON
  const response = await fetch(
    `${API_URL}/projects/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        name: values.name,
        description: values.description,
      }),
    }
  );

  if (response.status === 401) {
    throw new Error("Please sign in again to edit this project.");
  }
  if (!response.ok) {
    const result = await response.json().catch(() => null);

    // show the first field validation error when Laravel provides one
    const fieldError = Object.values(result?.errors ?? {}).flat()[0];

    throw new Error(
      fieldError ||
        result?.message ||
        `Could not update project (${response.status}).`
    );
  }
}

// receives the token and the id as a parameter
export async function deleteProject(id, token) {
  if (!API_URL) {
    throw new Error("The API URL is missing from the app configuration.");
  }

  const response = await fetch(
    `${API_URL}/projects/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: getProjectHeaders(token),
    }
  );

  if (response.status === 401) {
    throw new Error("Please sign in again to delete this project.");
  }

  // only parse the body on failure because a successful delete can return 204
  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(
      result?.message || `Could not delete project (${response.status}).`
    );
  }
}

// receives the token and the values for create a new project as a parameter
export async function createProject(values, token) {
  if (!API_URL) {
    throw new Error("The API URL is missing from the app configuration.");
  }

  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: {
      ...getProjectHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: values.name,
      description: values.description,
    }),
  });

  if (response.status === 401) {
    throw new Error("Please sign in again to create a project.");
  }

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    const fieldError = Object.values(result?.errors ?? {}).flat()[0];

    throw new Error(
      fieldError ||
        result?.message ||
        `Could not create project (${response.status}).`
    );
  }
}
