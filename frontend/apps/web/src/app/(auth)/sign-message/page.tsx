"use client";
import { useSearchParams } from "next/navigation";
import { useSignMessage } from "wagmi";

export default function SignPage() {
  const searchParams = useSearchParams();
  const message = decodeURIComponent(searchParams.get("message") || "");
  const { signMessage, data: signature } = useSignMessage();

  return (
    <div className="p-4">
      <h1 className="font-bold text-xl mb-4">Sign Message</h1>
      <p className="mb-4 whitespace-pre-line">{message}</p>
      <button
        onClick={() => signMessage({ message })}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Sign with MetaMask
      </button>
      {signature && (
        <p className="mt-4 text-sm text-gray-700 break-all">
          Signature: {signature}
        </p>
      )}
    </div>
  );
}
