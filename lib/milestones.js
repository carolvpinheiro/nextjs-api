const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

function getProjectHeaders(token) {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  return headers;
}

export async function listProjectMilestones(projectId, token) {
  if (!API_URL) {
    throw new Error("The API URL is missing from the app configuration.");
  }

  const response = await fetch(
    `${API_URL}/milestones/projects/${encodeURIComponent(projectId)}`,
    { headers: getProjectHeaders(token) }
  );
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || `Could not load milestones (${response.status}).`
    );
  }
  if (!Array.isArray(result?.data)) {
    throw new Error("The API returned an unexpected milestone list.");
  }

  return result.data;
}
