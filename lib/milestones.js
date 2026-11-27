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

export async function updateMilestone(milestoneId, values, token) {
  const response = await fetch(
    `${API_URL}/milestones/${encodeURIComponent(milestoneId)}`,
    {
      method: "PUT",
      headers: {
        ...getProjectHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    const fieldError = Object.values(result?.errors ?? {}).flat()[0];
    throw new Error(
      fieldError ||
        result?.message ||
        `Could not update the milestone (${response.status}).`
    );
  }
}

export async function deleteMilestone(milestoneId, token) {
  const response = await fetch(
    `${API_URL}/milestones/${encodeURIComponent(milestoneId)}`,
    {
      method: "DELETE",
      headers: getProjectHeaders(token),
    }
  );

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(
      result?.message || `Could not delete the milestone (${response.status}).`
    );
  }
}

export async function createMilestone(projectId, values, token) {
  const response = await fetch(`${API_URL}/milestones`, {
    method: "POST",
    headers: {
      ...getProjectHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      project_id: projectId,
      title: values.title,
      description: values.description ?? null,
      due_date: values.due_date ?? null,
      completed_at: null,
    }),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    const fieldError = Object.values(result?.errors ?? {}).flat()[0];

    throw new Error(
      fieldError ||
        result?.message ||
        `Could not create the milestone (${response.status}).`
    );
  }
}
