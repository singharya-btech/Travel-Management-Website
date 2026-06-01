const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API = BASE_URL + "/api";

export function authHeaders() {
  const token = localStorage.getItem("tb_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
