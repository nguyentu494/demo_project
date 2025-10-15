import api from "@/libs/axios";
import { ConfirmOtpData, AuthResponse } from "../../types/types";

export async function confirmOtp(data: ConfirmOtpData): Promise<AuthResponse> {
  const res = await api.post("/auth/confirm-otp", data);
  return res.data;
}
