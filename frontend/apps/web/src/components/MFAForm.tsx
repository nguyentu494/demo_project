"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface MFAFormProps {
  username: string;
  session: string;
  type: "SMS_MFA" | "SOFTWARE_TOKEN_MFA";
  onSuccess: () => void;
}

export default function MFAForm({
  username,
  session,
  type,
  onSuccess,
}: MFAFormProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          code,
          session,
          type,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onSuccess();
      } else {
        setError(data.error || "Mã xác thực không hợp lệ. Vui lòng thử lại.");
      }
    } catch (err) {
      setError("Lỗi mạng hoặc máy chủ không phản hồi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 mt-10 border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Xác thực đa yếu tố
      </h2>

      <p className="text-sm text-gray-600 text-center mb-6">
        {type === "SMS_MFA"
          ? "Nhập mã gồm 6 chữ số được gửi đến số điện thoại của bạn."
          : "Nhập mã gồm 6 chữ số từ ứng dụng Authenticator của bạn."}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          maxLength={6}
          pattern="\d{6}"
          inputMode="numeric"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Nhập mã 6 chữ số"
          className="border rounded-lg px-4 py-2 text-center text-lg tracking-widest focus:ring-2 focus:ring-orange-400 focus:outline-none"
          required
        />

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition flex justify-center items-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4 mr-2" /> Đang xác thực...
            </>
          ) : (
            "Xác nhận mã"
          )}
        </button>
      </form>

      <p className="text-xs text-gray-400 text-center mt-4">
        Mã xác thực chỉ có hiệu lực trong 30 giây.
      </p>
    </div>
  );
}
