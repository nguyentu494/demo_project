import api from "@/libs/axios"
import axios from "axios";

export interface verifyMessageProps {
  publicAddress: `0x${string}`;
  nonce: number;
  signature: `0x${string}`;
  chainId: number;
}

export interface verifyMessageResponse {
  accessToken: string;
  signature: string;
  publicAddress: `0x${string}`;
  nonce: number;
}

export const verifyMessage = async ({
  publicAddress,
  nonce,
  signature,
  chainId,
}: verifyMessageProps): Promise<verifyMessageResponse | undefined> => {
    try {
        const res = await axios.post("https://auth-api.luban.com.vn/api/v1/auth/sign-in/wallet", {
            publicAddress,
            nonce,
            signature,
            chainId,
        })
        return res.data.data
    } catch (error) {
        console.error(error)
    }
}