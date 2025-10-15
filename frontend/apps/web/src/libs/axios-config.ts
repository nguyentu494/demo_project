import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Hàm kiểm tra token còn < 2 phút thì nên refresh
function shouldRefresh(token: string): boolean {
  try {
    const decoded: { exp: number } = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp - now < 120;
  } catch {
    return false;
  }
}

// Refresh token nếu cần (trả về token mới hoặc null)
async function tryRefreshToken(oldToken: string): Promise<string | null> {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      { token: oldToken }
    );
    const newToken = res.data?.token;
    if (newToken) {
      localStorage.setItem("accessToken", newToken);
      return newToken;
    }
  } catch {
    localStorage.removeItem("accessToken");
  }
  return null;
}

// Request Interceptor
api.interceptors.request.use(async (config) => {
  if (typeof window === "undefined") return config;

  const token = localStorage.getItem("accessToken");
  if (!token) return config;

  // Nếu token gần hết hạn → refresh trước
  if (shouldRefresh(token)) {
    console.log("Gọi refresh");

    const newToken = await tryRefreshToken(token);
    if (newToken) {
      config.headers.Authorization = `Bearer ${newToken}`;
      return config;
    } else {
      console.log("Không refreshtoken đc");

      // Không refresh được → remove token luôn
      localStorage.removeItem("accessToken");
    }
  } else {
    // Token còn hạn → dùng như bình thường
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const oldToken = localStorage.getItem("accessToken");
      if (!oldToken) return Promise.reject(error);

      const newToken = await tryRefreshToken(oldToken);
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original); // retry
      }
    }

    return Promise.reject(error);
  }
);

export default api;
