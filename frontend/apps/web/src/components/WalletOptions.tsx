"use client";

import { AuthSignMessage } from "@/api/auth/signMessage";
import { verifyMessage } from "@/api/wallet";
import { useRouter } from "next/navigation";
import * as React from "react";
import {
  Connector,
  useAccount,
  useConnect,
  useDisconnect,
  useSignMessage,
} from "wagmi";

interface WalletOptionsProps {
  setIsVerifying?: (verifying: boolean) => void;
  verifying?: boolean;
}

export function WalletOptions({ setIsVerifying, verifying }: WalletOptionsProps) {
  const router = useRouter();
  const { connectors, connect } = useConnect();
  const { isConnected, address, chainId } = useAccount();
  const { disconnect, reset } = useDisconnect();
  const [isOpen, setIsOpen] = React.useState(false);
  const [nonce, setNonce] = React.useState<number | null>(null);

  const {
    signMessage,
    data: signature,
    variables,
    isSuccess: isSigned,
    isError,
    error,
  } = useSignMessage();

  React.useEffect(() => {
    setIsVerifying?.(verifying ?? true);
    const sign = async () => {
      if (isConnected && address) {
        const res = await AuthSignMessage();
        const data = await res;

        const message = `${data.data.data.message}`;
        setNonce(data.data.data.nonce);

        signMessage({ message });
      }
    };
    sign();
  }, [isConnected, address]);

  React.useEffect(() => {
    if (isSigned && signature && variables?.message && address) {
      (async () => {
        try {
          const res = await verifyMessage({
            publicAddress: address as `0x${string}`,
            nonce: nonce as number,
            signature: signature as `0x${string}`,
            chainId: chainId as number,
          });

          if (res?.accessToken) {
            document.cookie = `accessToken=${res.accessToken}; path=/; max-age=3600`;
            router.push("/home");
          } else {
            await disconnect();
            alert("Signature invalid!");
          }
        } catch (err) {
          await disconnect();
          console.error(err);
          alert("Verification failed.");
        }
      })();
    }
  }, [isSigned, signature]);

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
