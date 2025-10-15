import api from "@/libs/axios";
import { ResendOtpData, AuthResponse } from "../../types/types";

export async function resendOtp(data: ResendOtpData): Promise<AuthResponse> {
  const res = await api.post("/auth/resend-otp", data);
  return res.data;
}
