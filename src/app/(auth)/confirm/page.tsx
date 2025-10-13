"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ConfirmForm() {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const res = await fetch("/api/auth/confirm-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, code }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Xác minh thành công! Giờ bạn có thể đăng nhập.");
      setUsername("");
      setCode("");
      router.push("/login");
    } else {
      setError(data.error || "Xác minh thất bại.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Xác minh tài khoản
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Nhập mã 6 chữ số được gửi đến email của bạn để kích hoạt tài khoản.
        </p>

        <form onSubmit={handleConfirm} className="space-y-4">
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
            required
          />
          <input
            type="text"
            placeholder="Mã xác minh (OTP)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none text-center tracking-widest"
            required
          />

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          {message && (
            <p className="text-green-600 text-center text-sm">{message}</p>
          )}

          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 w-full text-white font-semibold py-2 rounded-lg transition"
          >
            Xác minh tài khoản
          </button>
        </form>
      </div>
    </div>
  );
}
