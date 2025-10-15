"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import {
  Step1Schema,
  Step1Type,
  Step2Schema,
  Step2Type,
} from "@/types/request/ForgotRequest";
import { forgotPassword } from "@/api/auth/forgotPassword";
import { confirmForgot } from "@/api/auth/confirmForgot";

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const sendCodeForm = useForm<Step1Type>({
    resolver: zodResolver(Step1Schema),
  });

  const resetForm = useForm<Step2Type>({
    resolver: zodResolver(Step2Schema),
  });

  async function handleSendCode(values: Step1Type) {
    try {
      setError("");
      setMessage("");
      setUsername(values.username);

      const data = await forgotPassword({ username: values.username });

      setStep(2);
      setMessage("Mã xác minh đã được gửi tới email của bạn.");
    } catch (err: any) {
      setError(err.message || "Không thể gửi mã. Hãy kiểm tra lại email.");
    }
  }

  async function handleConfirm(values: Step2Type) {
    try {
      setError("");
      setMessage("");

      const data = await confirmForgot(values);

      setStep(3);
      setMessage("Mật khẩu đã được đặt lại thành công!");
    } catch (err: any) {
      setError(err.message || "Mã xác minh không đúng hoặc đã hết hạn.");
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 pt-10">
      <div className="max-w-sm mx-auto mt-20 p-6 rounded-2xl shadow-xl bg-white">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">
          🔒 Quên mật khẩu
        </h1>

        {step === 1 && (
          <form
            onSubmit={sendCodeForm.handleSubmit(handleSendCode)}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Email hoặc username"
              {...sendCodeForm.register("username")}
              className="w-full border rounded-lg px-4 py-2 text-black"
            />
            <ErrorMessage
              errors={sendCodeForm.formState.errors}
              name="username"
              render={({ message }) => (
                <p className="text-red-500 text-sm">{message}</p>
              )}
            />
            <button
              type="submit"
              disabled={sendCodeForm.formState.isSubmitting}
              className={`font-semibold py-2 rounded-lg transition w-full ${
                sendCodeForm.formState.isSubmitting
                  ? "bg-gray-400 cursor-not-allowed text-gray-700"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              {sendCodeForm.formState.isSubmitting
                ? "Đang gửi..."
                : "Gửi mã xác minh"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={resetForm.handleSubmit(handleConfirm)}
            className="space-y-4"
          >
            <input
              type="hidden"
              value={username}
              {...resetForm.register("username")}
            />
            <input
              type="text"
              placeholder="Nhập mã xác minh"
              {...resetForm.register("code")}
              className="w-full border rounded-lg px-4 py-2 text-black"
            />
            <ErrorMessage
              errors={resetForm.formState.errors}
              name="code"
              render={({ message }) => (
                <p className="text-red-500 text-sm">{message}</p>
              )}
            />
            <input
              type="password"
              placeholder="Mật khẩu mới"
              {...resetForm.register("newPassword")}
              className="w-full border rounded-lg px-4 py-2 text-black"
            />
            <ErrorMessage
              errors={resetForm.formState.errors}
              name="newPassword"
              render={({ message }) => (
                <p className="text-red-500 text-sm">{message}</p>
              )}
            />
            <button
              type="submit"
              disabled={resetForm.formState.isSubmitting}
              className={`font-semibold py-2 rounded-lg transition w-full ${
                resetForm.formState.isSubmitting
                  ? "bg-gray-400 cursor-not-allowed text-gray-700"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              {resetForm.formState.isSubmitting
                ? "Đang xử lý..."
                : "Đặt lại mật khẩu"}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center space-y-2">
            <p className="text-green-600 font-semibold">
              ✅ Mật khẩu đã được đặt lại thành công!
            </p>
            <a href="/login" className="text-blue-600 underline">
              Quay lại trang đăng nhập
            </a>
          </div>
        )}

        {(message || error) && (
          <p
            className={`mt-4 text-center ${
              error ? "text-red-500" : "text-green-600"
            }`}
          >
            {error || message}
          </p>
        )}
      </div>
    </div>
  );
}
