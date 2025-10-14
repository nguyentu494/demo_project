"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/hooks/useAuthStore";

const ConfirmSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập không hợp lệ."),
  code: z.string().regex(/^\d{6}$/, "Mã OTP phải gồm 6 chữ số."),
});

type ConfirmSchemaType = z.infer<typeof ConfirmSchema>;

export default function ConfirmForm() {
  const router = useRouter();
  const { username: storedUsername, clearUsername } = useAuthStore();
  const [serverError, setServerError] = useState("");
  const [serverMessage, setServerMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmSchemaType>({
    resolver: zodResolver(ConfirmSchema),
    defaultValues: { username: storedUsername || "" },
  });

  const disableUsername = !!storedUsername;

  const onSubmit = async (data: ConfirmSchemaType) => {
    setServerError("");
    setServerMessage("");

    try {
      const res = await fetch("/api/auth/confirm-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setServerMessage("✅ Xác minh thành công! Giờ bạn có thể đăng nhập.");
        clearUsername();
        router.push("/login");
      } else {
        setServerError(result.error || "Xác minh thất bại.");
      }
    } catch {
      setServerError("Không thể kết nối đến máy chủ.");
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 text-black"
        >
          <div>
            <input
              type="text"
              placeholder="Tên đăng nhập"
              {...register("username")}
              disabled={disableUsername}
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none hidden ${
                disableUsername
                  ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                  : ""
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Mã xác minh (OTP)"
              {...register("code")}
              className="w-full border rounded-lg px-4 py-2 text-center tracking-widest focus:ring-2 focus:ring-orange-400 outline-none"
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-red-500 text-center text-sm">{serverError}</p>
          )}
          {serverMessage && (
            <p className="text-green-600 text-center text-sm">
              {serverMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 font-semibold rounded-lg transition ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed text-gray-700"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            {isSubmitting ? "Đang xác minh..." : "Xác minh tài khoản"}
          </button>
        </form>
      </div>
    </div>
  );
}
