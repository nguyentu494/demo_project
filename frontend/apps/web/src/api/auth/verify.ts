import api from "@/libs/axios";
import { VerifyData } from "../../types/types";
import axios from "axios";

export async function verify(data: VerifyData): Promise<{ verified: boolean }> {
  const res = await api.post("/auth/verify", data);
  return res.data;
}
