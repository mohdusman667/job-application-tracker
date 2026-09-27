const API_URL = "http://localhost:5000/api/applications";

async function readResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "The request failed.");
  }

  return data;
}

export async function getApplications() {
  const response = await fetch(API_URL);
  return readResponse(response);
}

export async function createApplication(application) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(application),
  });

  return readResponse(response);
}

export async function updateApplication(id, changes) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changes),
  });

  return readResponse(response);
}

export async function deleteApplication(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  return readResponse(response);
}
export async function analyzeJobDescription(description) {
  const response = await fetch("http://localhost:5000/api/ai/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Could not analyze the job description.");
  }

  return data.analysis;
}