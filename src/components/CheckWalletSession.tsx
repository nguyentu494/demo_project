"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useDisconnect } from "wagmi";
import { config } from "../../config";

export function WalletSessionSync() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { disconnect, reset, isError, isPending } = useDisconnect({config: config, mutation: { onError(error) {
    console.error("Disconnect error:", error);
  }}});

  useEffect(() => {
    const handler = async () => {
      const hasToken = document.cookie.includes("accessToken=");
      if (!hasToken && isConnected) {
        try {
          disconnect();
          
          // reset();
        } catch (err) {
          console.error("Error during disconnect:", err);
        } finally {
          // router.push("/login");
        }
      }
      if (isConnected) return;
      try {
        await fetch("/api/auth/log-out", { method: "POST" });
        router.push("/login");
      } catch (err) {
        console.error("Failed to logout:", err);
      }
    };

    handler();
  }, [router, isConnected]);

  return null;
}
