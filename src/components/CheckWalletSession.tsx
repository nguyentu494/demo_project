"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useDisconnect } from "wagmi";

export function WalletSessionSync() {
  const router = useRouter();
  const { isConnected, connector } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const handleDisconnectWallet = useCallback(async () => {
    try {
      console.log("Log ~ WalletSessionSync ~ connector:", connector);
      await disconnectAsync().then((res) => {
        console.log("Log ~ handleDisconnectWallet ~ res:", res);
      });
    } catch (error) {
      console.log("Log ~ handleDisconnectWallet ~ error:", error);
    }
  }, [connector, disconnectAsync]);

  useEffect(() => {
    const checkSessionAndWallet = async () => {
      try {
        const res = await fetch("/api/auth/check-me", {
          method: "GET",
          credentials: "include", 
        });

        const data = await res.json();
        const authenticated = data.authenticated;

        console.log("Auth status:", authenticated, "isConnected:", isConnected);

        if (!authenticated && isConnected) {
          await handleDisconnectWallet();
        }

        if (!isConnected && !authenticated) {
          try {
            await fetch("/api/auth/log-out", {
              method: "POST",
              credentials: "include",
            });

            // const logoutUrl = `${
            //   process.env.NEXT_PUBLIC_COGNITO_DOMAIN
            // }/logout?client_id=${
            //   process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID
            // }&logout_uri=${encodeURIComponent(
            //   process.env.NEXT_PUBLIC_LOGOUT_REDIRECT_URI!
            // )}`;

            // window.location.href = logoutUrl;

            router.push("/login");
          } catch (err) {
            console.error("Failed to logout:", err);
          }
        }
      } catch (err) {
        console.error("Failed to check session:", err);
      }
    };

    checkSessionAndWallet();

  }, [handleDisconnectWallet, isConnected, router]);

  return null;
}
