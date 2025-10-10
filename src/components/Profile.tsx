import React, { useEffect } from "react";

import { getBalance } from "wagmi/actions";
import { config } from "../../config";
import { WalletOptions } from "./WalletOptions";
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSignMessage,
} from "wagmi";
import { useRouter } from "next/navigation";

export function Profile() {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
  const [balance, setBalance] = React.useState<any>(null);
  const { reset, isPending } = useSignMessage();
  const router = useRouter();

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
    </div>
  );
}
