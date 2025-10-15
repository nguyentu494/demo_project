import api from "@/libs/axios";
import { RegisterData, AuthResponse } from "../../types/types";

export async function signUp(
  registerData: RegisterData
): Promise<AuthResponse> {
  const res = await api.post("/auth/register", registerData);
  return res.data;
}
