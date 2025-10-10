"use client";

import { SignMessage } from "@/hooks/useSignMessage";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect } from "react";
import Link from "next/link";

export default function Sign() {
  const { isConnected, address } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isConnected && !address) {
      disconnect();
    }
  }, [isConnected, address, disconnect]);

  if (isConnected) {
    return (
      <div>
        <SignMessage />
        <button
          onClick={() => {
            disconnect();
            localStorage.removeItem("isSigned");
          }}
          className="mt-4 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        You are not connected. Please connect your wallet to view your profile.
      </p>
      <Link href="/login">
        <button className="mt-4 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
          Back to Login
        </button>
      </Link>
    </div>
  );
}
