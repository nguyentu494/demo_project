"use client";

import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export function CognitoLoginButton() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signIn("cognito", { callbackUrl: "/home" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="w-full bg-orange-400 hover:bg-orange-500 text-white rounded-lg py-2 font-semibold transition flex items-center justify-center"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang chuyển hướng...
        </>
      ) : (
        "Đăng nhập với Cognito"
      )}
    </button>
  );
}
