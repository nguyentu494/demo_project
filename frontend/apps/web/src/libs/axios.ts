import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://auth-api.luban.com.vn/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  if (typeof window === "undefined") return config;

  const token = localStorage.getItem("accessToken");
  if (!token) return config;

  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const oldToken = localStorage.getItem("accessToken");
      if (!oldToken) return Promise.reject(error);

    }

    return Promise.reject(error);
  }
);


export default api;
