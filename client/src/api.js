   const BASE_URL =
     import.meta.env.VITE_API_URL ||
     "https://job-application-tracker-d8s6.onrender.com/api";
const API_URL = `${BASE_URL}/applications`;

export function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

async function readResponse(response) {
  const data = await response.json().catch(() => ({}));

  // Token missing or expired: log the user out and show the login page
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  }

  if (!response.ok) {
    throw new Error(data.message || "The request failed.");
  }

  return data;
}

// ---------- Login and register ----------

async function authRequest(path, body) {
  const response = await fetch(`${BASE_URL}/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Authentication failed.");
  }

  return data;
}

export function registerUser(name, email, password) {
  return authRequest("register", { name, email, password });
}

export function loginUser(email, password) {
  return authRequest("login", { email, password });
}
   export function requestPasswordReset(email) {
     return authRequest("forgot-password", { email });
   }

   export function resetPassword(token, password) {
     return authRequest("reset-password", { token, password });
   }

// ---------- Applications ----------

export async function getApplications() {
  const response = await fetch(API_URL, { headers: authHeaders() });
  return readResponse(response);
}

export async function createApplication(application) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(application),
  });

  return readResponse(response);
}

export async function updateApplication(id, changes) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(changes),
  });

  return readResponse(response);
}

export async function deleteApplication(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return readResponse(response);
}

// ---------- AI tools ----------

export async function analyzeJobDescription(description, skills) {
  const response = await fetch(`${BASE_URL}/ai/analyze`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ description, skills }),
  });

  const data = await readResponse(response);
  return data.analysis;
}

export async function draftFollowUpEmail(application) {
  const response = await fetch(`${BASE_URL}/ai/draft-email`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      company: application.company,
      jobTitle: application.jobTitle,
      status: application.status,
    }),
  });

  const data = await readResponse(response);
  return data.draft;
}