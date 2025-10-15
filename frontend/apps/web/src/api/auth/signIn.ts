import api from "@/libs/axios";
import { LoginCredentials, AuthResponse } from "../../types/types";
import { saveAuth } from "@/libs/local-storage";

export async function signIn(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const res = await api.post("/auth/login", credentials);
  const data = res.data.data;
  saveAuth(data.accessToken, data.refreshToken, data.idToken)
  return res.data;
}
