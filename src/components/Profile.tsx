"use client";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import { getBalance } from "wagmi/actions";
import { config } from "../../config";
import React, { useEffect } from "react";

export function Profile() {
  const { isConnected, address } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
  const [balance, setBalance] = React.useState<any>(null);

  useEffect(() => {
    if (isConnected && address) {
      const fetchBalance = async () => {
        const balance = await getBalance(config, { address });
        setBalance(balance);
      };
      fetchBalance();
    }
  }, [isConnected, address]);

  return (
    <div>
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
      {balance && (
        <div>
          Balance: {Number(balance.value).toFixed(4)} {balance.symbol}
        </div>
      )}
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  );
}
