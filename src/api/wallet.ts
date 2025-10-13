import api from "@/libs/axios"

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
        const res = await api.post("auth/sign-in/wallet", {
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