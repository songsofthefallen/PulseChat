import axios from "axios";

/**
 * Central Axios instance. Points at a placeholder base URL — swap
 * NEXT_PUBLIC_API_URL in .env.local once the real backend is available.
 * No auth/session logic lives here beyond attaching the bearer token;
 * the actual auth flow (issuing/refreshing JWTs) is a backend concern.
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api/placeholder",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = typeof window !== "undefined"
    ? window.localStorage.getItem("pulsechat-access-token")
    : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Placeholder for refresh-token handling. Wire this up to the real
// auth endpoints — this only documents the intended shape.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // TODO: attempt refresh via POST /auth/refresh, retry original request.
    }
    return Promise.reject(error);
  }
);
