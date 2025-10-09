"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WalletOptions } from "@/components/WalletOptions";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) router.push("/profile");
    else alert("Invalid credentials");
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-50 flex-col ">
      <div className=" flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm space-y-5"
        >
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Login
          </h1>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-semibold transition"
          >
            Sign In
          </button>
        </form>
      </div>
      <WalletOptions />
    </div>
  );
}
