"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useDisconnect } from "wagmi";

export function WalletSessionSync() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { disconnect, reset } = useDisconnect({});

  useEffect(() => {
    const handler = async () => {
      const hasToken = document.cookie.includes("accessToken=");
      if (!hasToken && isConnected) {
        try {
          disconnect;
          reset();
        } catch (err) {
          console.error("Error during disconnect:", err);
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
