"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WalletOptions } from "@/components/WalletOptions";
import { useAccount, useDisconnect } from "wagmi";
import { CognitoLoginButton } from "@/components/CognitoButton";
import MFAForm from "@/components/MFAForm"; 
import Link from "next/link";
export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // const [mfaRequired, setMfaRequired] = useState(false);
  const [session, setSession] = useState("");
  // const [mfaType, setMfaType] = useState<"SMS_MFA" | "SOFTWARE_TOKEN_MFA" | "">(
  //   ""
  // );

  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // setMfaRequired(false);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      // if (data.challenge && data.session) {
      //   // setMfaRequired(true);
      //   setSession(data.session);
      //   // setMfaType(data.challenge);
      // } else 
      if (data.success) {
        router.push("/home");
      } else {
        setError("Sai thông tin đăng nhập hoặc lỗi hệ thống.");
      }
    } catch (err) {
      setError("Lỗi mạng hoặc máy chủ không phản hồi.");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/check-me");
        const data = await res.json();
        if (data.authenticated) router.push("/home");
        else if (!res.ok && isConnected && !isVerifying) disconnect();
      } catch {
        if (isConnected && !isVerifying) disconnect();
      }
    })();
  }, [isConnected, disconnect, isVerifying, router]);

  // if (mfaRequired) {
  //   return (
  //     <MFAForm
  //       username={username}
  //       session={session}
  //       type={mfaType as "SMS_MFA" | "SOFTWARE_TOKEN_MFA"}
  //       onSuccess={() => router.push("/home")}
  //     />
  //   );
  // }

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-50 flex-col">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm space-y-5">
        <form onSubmit={handleLogin}>
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Đăng nhập Cognito
          </h1>

          <div className="space-y-3 mt-4">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />

            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2 font-semibold transition mt-5"
          >
            Đăng nhập
          </button>
        </form>

        <div className="w-full h-0.5 bg-gray-200 my-4"></div>

        <WalletOptions
          verifying={isVerifying}
          setIsVerifying={setIsVerifying}
        />
        {/* <CognitoLoginButton /> */}
        <Link href="/register" className="text-sm text-gray-500 hover:underline">
          Đăng ký tài khoản
        </Link>
      </div>
    </div>
  );
}
