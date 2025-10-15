import api from "@/libs/axios";
import { ConfirmForgotData, AuthResponse } from "../../types/types";

export async function confirmForgot(
  data: ConfirmForgotData
): Promise<AuthResponse> {
  const res = await api.post("/auth/confirm-forgot", data);
  return res.data;
}
