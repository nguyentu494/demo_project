"use client";

import * as React from "react";
import { useAccount, useSignMessage } from "wagmi";
import { recoverMessageAddress } from "viem";
import { useRouter } from "next/navigation";

export function SignMessage() {
  const router = useRouter();
  const { address } = useAccount();
  const [recoveredAddress, setRecoveredAddress] = React.useState<string>("");
  const [verified, setVerified] = React.useState<boolean | null>(null);
  const {
    data: signature,
    error,
    isPending,
    signMessage,
    variables,

  } = useSignMessage();

  React.useEffect(() => {
    (async () => {
      if (variables?.message && signature) {
        try {
          const addr = await recoverMessageAddress({
            message: variables.message,
            signature,
          });
          setRecoveredAddress(addr);

          const res = await fetch("/api/auth/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              address,
              message: variables.message,
              signature,
            }),
          });

          const data = await res.json();
          if (res.ok && data.verified) {
            setVerified(true);
            router.push("/profile");
          } else {
            setVerified(false);
          }
        } catch (e) {
          console.error("Verify failed:", e);
          setRecoveredAddress("");
        }
      }
    })();
  }, [signature, variables?.message, address, router]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const message = formData.get("message") as string | null;
    if (!message) return;
    signMessage({ message });
  };
}
