import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "./tokenStore";

console.log("🔥 API CLIENT LOADED");

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "/api/placeholder";

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  console.log("🔥 Req interceptor");

  

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  else {
    console.log("empty token")
  }

  return config;
});

async function refreshAccessToken(): Promise<string> {
  const response = await axios.post(
    `${API_URL}/auth/refresh`,
    {},
    {
      withCredentials: true,
    }
  );

  const newAccessToken = response.data.access_token;

  setAccessToken(newAccessToken);

  return newAccessToken;
}

let refreshPromise: Promise<string> | null = null;

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      clearAccessToken();

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken();
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return apiClient(originalRequest);

    } catch (refreshError) {
      clearAccessToken();

      return Promise.reject(refreshError);

    } finally {
      refreshPromise = null;
    }
  }
);