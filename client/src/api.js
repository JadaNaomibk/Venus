// src/api.js
// helper to talk to the backend

const API_BASE_URL = "http://localhost:5001/api"

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include", // send cookies like authToken
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.message || "request failed.")
  }

  return data
}
