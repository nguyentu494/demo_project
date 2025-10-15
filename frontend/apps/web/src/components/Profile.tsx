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
import { getUser, logOut } from "@/api";

export function Profile() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { reset } = useSignMessage();

  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  const [balance, setBalance] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const chains = useChains();
  const chainId = useChainId();
  const { switchChain, status, error } = useSwitchChain();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser();
        setUser(data);
      } catch (err: any) {
        console.warn("Cannot fetch user:", err.message);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!isConnected || !address) return;
    (async () => {
      const bal = await getBalance(config, { address });
      setBalance(bal);
    })();
  }, [isConnected, address]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      disconnect();
      reset();

      const res = await logOut();

      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const currentChain = useMemo(
    () => chains.find((c) => c.id === chainId),
    [chains, chainId]
  );

  if (!isMounted) return null;

  if (!user)
    return <p className="text-gray-600 p-4">Loading user information...</p>;

  return (
    <div className="text-black space-y-6">
      <div className="p-4 bg-white border rounded-lg shadow-sm space-y-2">
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        {Object.entries(user.attributes ?? {}).map(([key, value]) => (
          <p key={key}>
            <strong>{key}:</strong> {value as string}
          </p>
        ))}
      </div>

      <div className="space-y-4">
        {ensAvatar && (
          <img
            alt="ENS Avatar"
            src={ensAvatar}
            className="w-14 h-14 rounded-full"
          />
        )}

        {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}

        {balance && (
          <div>
            Balance: {Number(balance.value).toFixed(4)} {balance.symbol}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`px-3 py-1.5 rounded-md text-white transition-all ${
            isLoggingOut
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {isLoggingOut ? "Logging out..." : "Log out"}
        </button>
      </div>

      <div className="p-4 border rounded-lg shadow-sm w-fit space-y-3 bg-white mt-4">
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
