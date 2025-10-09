"use client";

import { SignMessage } from "@/hooks/useSignMessage";
import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";


export default function Profile() {
  const { isConnected, address } = useAccount();
  

  if (isConnected) {
    return (
      <div>
        <SignMessage />
      </div>
    );
  }

  return (
    <div>
        <p>
            You are not connected. Please connect your wallet to view your profile.
        </p>
      <button onClick={() => window.location.href = '/login'}>
        Back to Login
      </button>
    </div>
  );
}
