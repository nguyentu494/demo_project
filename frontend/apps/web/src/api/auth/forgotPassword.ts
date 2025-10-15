import api from "@/libs/axios";
import { ForgotPasswordData, AuthResponse } from "../../types/types";

export async function forgotPassword(
  data: ForgotPasswordData
): Promise<AuthResponse> {
  const res = await api.post("/auth/forgot-password", data);
  return res.data;
}
