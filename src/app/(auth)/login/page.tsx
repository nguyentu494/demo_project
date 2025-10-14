"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WalletOptions } from "@/components/WalletOptions";
import { useAccount, useDisconnect } from "wagmi";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { LoginRequest, LoginRequestType } from "@/types/request/LoginRequest";
import { zodResolver } from "@hookform/resolvers/zod";
export default function LoginPage() {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequestType>({
    resolver: zodResolver(LoginRequest),
  });

  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const onSubmit = async (data: any) => {
    const { username, password } = data;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();

      if (result.success) {
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
        const result = await res.json();
        if (result.authenticated) router.push("/home");
        else if (!res.ok && isConnected && !isVerifying) disconnect();
      } catch {
        if (isConnected && !isVerifying) disconnect();
      }
    })();
  }, [isConnected, disconnect, isVerifying, router]);

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-50 flex-col">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm space-y-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Đăng nhập Cognito
          </h1>

          <div className="space-y-3 mt-4">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              {...register("username", { required: true })}
              className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
            />
            <ErrorMessage
              errors={errors}
              name="username"
              render={({ message }) => (
                <p className="text-red-500 text-sm">{message}</p>
              )}
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              {...register("password", { required: true })}
              className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
            />
            <ErrorMessage
              errors={errors}
              name="password"
              render={({ message }) => (
                <p className="text-red-500 text-sm">{message}</p>
              )}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`font-semibold py-2 rounded-lg transition w-full ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed text-gray-700"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="w-full h-0.5 bg-gray-200 my-4"></div>

        <WalletOptions
          verifying={isVerifying}
          setIsVerifying={setIsVerifying}
        />
        <Link
          href="/register"
          className="text-sm text-gray-500 hover:underline"
        >
          Đăng ký tài khoản
        </Link>
      </div>
    </div>
  );
}
