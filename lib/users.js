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
export async function listUsers(token) {
  // check the API URL before sending the request
  if (!API_URL) {
    throw new Error("The API URL is missing from the app configuration.");
  }
  const headers = getProjectHeaders(token);
  // sent GET request to projects
  const response = await fetch(`${API_URL}/users`, { headers });

  // deal with unauthorized response
  if (response.status === 401) {
    throw new Error("Please sign in again.");
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
  const users = result?.data ?? result;

  // deal with unexpected projects response
  if (!Array.isArray(users)) {
    throw new Error("The API returned an unexpected projects response.");
  }

  return users;
}
