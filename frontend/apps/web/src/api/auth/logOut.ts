import api from "@/libs/axios";
import { clearAuth, getRefreshToken } from "@/libs/local-storage";

export async function logOut(): Promise<boolean> {
  const res = await api.post("/auth/log-out", {
    refreshToken: getRefreshToken() || "",
  });
  const data = res.data;
  if(data.code === 200){
    clearAuth()
    return true;
  }
  return false;
}
