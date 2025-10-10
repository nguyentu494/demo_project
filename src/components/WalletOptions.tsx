"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Connector, useConnect, useAccount } from "wagmi";

export function WalletOptions() {
  const router = useRouter();
  const { connectors, connect } = useConnect();
  const { isConnected } = useAccount();

  React.useEffect(() => {
    if (isConnected) {
      document.cookie = "isLogged=true; path=/; max-age=3600";
      router.push("/home");
    }
  }, [isConnected, router]);

  return (
    <div className="flex flex-wrap">
      {connectors.map((connector) => (
        <WalletOption
          key={connector.uid}
          connector={connector}
          onClick={() => connect({ connector })}
        />
      ))}
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
      className="w-40 p-2 m-2 border rounded bg-blue-400 text-white hover:bg-blue-500 disabled:opacity-50"
    >
      {connector.name}
    </button>
  );
}
