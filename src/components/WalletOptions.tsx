"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import {
  Connector,
  useAccount,
  useConnect,
  useDisconnect,
  useSignMessage,
} from "wagmi";

export function WalletOptions() {
  const router = useRouter();
  const { connectors, connect, data: connectData } = useConnect();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = React.useState(false);

  const {
    signMessage,
    data: signature,
    variables,
    isSuccess: isSigned,
  } = useSignMessage();

  React.useEffect(() => {
    if (isConnected && address) {
      const message = `
    Please sign this message to verify your wallet ownership.
    Address: ${address}
    Nonce: ${Math.floor(Math.random() * 1000000)}`;
      signMessage({ message });
    }
  }, [isConnected, address]);

  console.log(isConnected)

  React.useEffect(() => {
    if (isSigned && signature && variables?.message && address) {
      (async () => {
        try {
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

          if (data.verified) {
            document.cookie = "isLogged=true; path=/; max-age=3600";
            router.push("/home");
          } else {
            disconnect();
            alert("Signature invalid!");
          }
        } catch (err) {
          disconnect();
          console.error(err);
          alert("Verification failed.");
        }
      })();
    }
  }, [isSigned, signature, variables, address, disconnect, router]);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-semibold transition"
      >
        Connect Wallet
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[360px] relative">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Choose your wallet
            </h2>

            <div className="space-y-2">
              {connectors.map((connector) => (
                <WalletOption
                  key={connector.uid}
                  connector={connector}
                  onClick={() => connect({ connector })}
                />
              ))}
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 max-w-40"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function WalletOption({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <button
      disabled={!ready}
      onClick={onClick}
      className="w-full py-2 border rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition disabled:opacity-50"
    >
      {connector.name}
    </button>
  );
}
