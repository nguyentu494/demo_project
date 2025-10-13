"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Đăng ký thành công! Kiểm tra email để xác minh tài khoản.");
      setUsername("");
      setEmail("");
      setPassword("");
      router.push("/confirm");
    } else {
      setError(data.error || "Đăng ký thất bại.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 pt-10">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Đăng ký tài khoản
        </h2>

        <form
          onSubmit={handleRegister}
          className="flex flex-col space-y-4 text-black"
        >
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            required
          />
          <input
            type="email"
            placeholder="Địa chỉ email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            required
          />

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          {message && (
            <p className="text-green-600 text-center text-sm">{message}</p>
          )}

          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
}
