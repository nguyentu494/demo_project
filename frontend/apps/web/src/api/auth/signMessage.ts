import api from "@/libs/axios";
import axios from "axios";

export async function AuthSignMessage(): Promise<any> {
  const res = await axios.get(
    "https://auth-api.luban.com.vn/api/v1/auth/sign-message"
  );
  return res.data;
}
