import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "/api/placeholder";

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


async function refreshAccessToken(): Promise<void> {
  await axios.post(
    `${API_URL}/auth/refresh`,
    {},
    {
      withCredentials: true,
    }
  );
}

let refreshPromise: Promise<void> | null = null;

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
      return Promise.reject(error);
    }


    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken();
      }

    await refreshPromise;

    return apiClient(originalRequest);

    }  
    catch (refreshError) {
      return Promise.reject(refreshError);

    } finally {
      refreshPromise = null;
    }
  }
);