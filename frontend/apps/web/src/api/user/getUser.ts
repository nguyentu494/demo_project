import api from "@/libs/axios";
import { UserInfo } from "../../types/types";

export async function getUser(): Promise<UserInfo> {
  const res = await api.get("/user");
  return res.data.data;
}
