"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import {
  useAccount,
  useChainId,
  useChains,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSignMessage,
  useSwitchChain,
} from "wagmi";
import { getBalance } from "wagmi/actions";
import { config } from "../../config";
import { WalletOptions } from "./WalletOptions";

export function Profile() {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
  const [balance, setBalance] = React.useState<any>(null);
  const { reset, isPending } = useSignMessage();
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const chains = useChains();
  const chainId = useChainId();
  const { switchChain, status, error } = useSwitchChain();

  console.log(chainId, "thiss is chainId");
  console.log(chains);
  const currentChain = useMemo(
    () => chains.find((c) => c.id === chainId),
    [chains, chainId]
  );

  useEffect(() => {
    if (isConnected && address) {
      const fetchBalance = async () => {
        const balance = await getBalance(config, { address });
        setBalance(balance);
      };
      fetchBalance();
    }
  }, [isConnected, address]);

  const handleDisconnect = async () => {
    disconnect();
    reset();
    await fetch("/api/auth/log-out", {
      method: "POST",
    });
    router.push("/login");
  };
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (!isConnected && !isPending) {
    return (
      <div>
        <h3 className="text-black">
          Please connect your wallet to view your profile.
        </h3>
        <WalletOptions />
      </div>
    );
  }

  return (
    <div className="text-black">
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
      {balance && (
        <div>
          Balance: {Number(balance.value).toFixed(4)} {balance.symbol}
        </div>
      )}
      <button onClick={handleDisconnect}>Disconnect</button>
      <div className="p-4 border rounded-lg shadow-sm w-fit space-y-3 bg-white">
        <h3 className="text-lg font-semibold text-gray-800">Chain Info</h3>

        {currentChain ? (
          <div className="space-y-1">
            <p className="text-sm">
              <strong>Name:</strong> {currentChain.name}
            </p>
            <p className="text-sm">
              <strong>ID:</strong> {currentChain.id}
            </p>
            <p className="text-sm">
              <strong>Network:</strong> {currentChain.nativeCurrency.name}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No chain connected</p>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">
            Switch chain:
          </label>
          <select
            className="border px-2 py-1 rounded-md text-sm"
            value={chainId || ""}
            onChange={(e) => switchChain({ chainId: Number(e.target.value) })}
          >
            {chains.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {status === "pending" && (
          <p className="text-xs text-yellow-600">Switching chain...</p>
        )}
        {error && <p className="text-xs text-red-600">{error.message}</p>}
      </div>
    </div>
  );
}
