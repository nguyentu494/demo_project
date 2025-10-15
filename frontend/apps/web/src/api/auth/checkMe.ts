import api from "@/libs/axios";
import { CheckMeResponse } from "../../types/types";

export async function checkMe(): Promise<CheckMeResponse> {
  const res = await api.get("/auth/check-me");
  return res.data;
}
