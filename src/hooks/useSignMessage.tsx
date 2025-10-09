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

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label htmlFor="message" className="block text-sm font-medium">
        Enter a message to sign
      </label>
      <textarea
        id="message"
        name="message"
        placeholder="The quick brown fox…"
        className="w-full rounded border p-2"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
      >
        {isPending ? "Check Wallet…" : "Sign Message"}
      </button>

      {signature && (
        <div className="mt-3 space-y-1">
          <div>
            <strong>Recovered Address:</strong> {recoveredAddress || "—"}
          </div>
          <div className="break-all">
            <strong>Signature:</strong> {signature}
          </div>
        </div>
      )}

      {verified === true && (
        <p className="text-green-600">✅ Signature verified — Logged in!</p>
      )}
      {verified === false && (
        <p className="text-red-600">❌ Invalid signature!</p>
      )}

      {error && <div className="mt-2 text-red-600">{error.message}</div>}
    </form>
  );
}
