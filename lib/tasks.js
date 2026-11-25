const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

// build the headers for task requests, including the bearer token
function getProjectHeaders(token) {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  return headers;
}

export async function listProjectTasks(projectId, token) {
  // use the project ID to fetch only the tasks that belong to this project.
  const response = await fetch(
    `${API_URL}/tasks/projects/${encodeURIComponent(projectId)}`,
    { headers: getProjectHeaders(token) }
  );
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || `Could not load tasks (${response.status}).`
    );
  }
  const tasks = result?.data ?? result;

  if (!Array.isArray(tasks)) {
    throw new Error("The API returned an unexpected task list.");
  }

  return tasks;
}

export async function createTask(projectId, values, token) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      ...getProjectHeaders(token),
      // tell Laravel that the request body contains JSON
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      project_id: projectId,
      name: values.name,
      status: values.status,
      description: values.description ?? null,
      due_date: values.due_date ?? null,
      assigned_to: values.assigned_to ?? null,
    }),
  });

  const result = await response.json().catch(() => null);
  console.log("Create task response", response.status, result);

  if (!response.ok) {
    const fieldError = Object.values(result?.errors ?? {}).flat()[0];

    throw new Error(
      fieldError ||
        result?.message ||
        `Could not create the task (${response.status}).`
    );
  }
}

export async function getTask(taskId, token) {
  const response = await fetch(
    `${API_URL}/tasks/${encodeURIComponent(taskId)}`,
    { headers: getProjectHeaders(token) }
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || `Could not load the task (${response.status}).`
    );
  }

  const task = result?.data ?? result;
  if (!task?.id) {
    throw new Error("The API returned an unexpected task.");
  }

  return task;
}

export async function updateTask(taskId, projectId, values, token) {
  const response = await fetch(
    `${API_URL}/tasks/${encodeURIComponent(taskId)}`,
    {
      method: "PUT",
      headers: {
        ...getProjectHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id: projectId,
        name: values.name,
        status: values.status,
        description: values.description ?? null,
        due_date: values.due_date ?? null,
        assigned_to: values.assigned_to ?? null,
      }),
    }
  );

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    const fieldError = Object.values(result?.errors ?? {}).flat()[0];

    throw new Error(
      fieldError ||
        result?.message ||
        `Could not update the task (${response.status}).`
    );
  }
}
