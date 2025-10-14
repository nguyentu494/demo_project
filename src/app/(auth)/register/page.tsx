"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, RegisterSchemaType } from "@/types/request/RegisterRequest";
import { ErrorMessage } from "@hookform/error-message";
import { useAuthStore } from "@/hooks/useAuthStore";


export default function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [message, setMessage] = useState("");

  const { setUsername } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
  });

  const password = watch("password", "");

  const onSubmit = async (data: RegisterSchemaType) => {
    setServerError("");
    setMessage("");
    const { repassword, ...registerData } = data;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const result = await res.json();

      if (res.ok) {
        setUsername(registerData.username);

        setMessage("Đăng ký thành công! Kiểm tra email để xác minh tài khoản.");
        router.push("/confirm");
      } else {
        setServerError(result.error || "Đăng ký thất bại.");
      }
    } catch {
      setServerError("Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 pt-10">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Đăng ký tài khoản
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit, (err) => {
            console.log("❌ validation failed:", err);
          })}
          className="flex flex-col space-y-4 text-black"
        >
          <div>
            <input
              type="text"
              placeholder="Tên đăng nhập"
              {...register("username")}
              className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <ErrorMessage
              errors={errors}
              name="username"
              render={({ message }) => (
                <p className="text-red-500 text-sm mt-1">{message}</p>
              )}
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Địa chỉ email"
              {...register("email")}
              className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <ErrorMessage
              errors={errors}
              name="email"
              render={({ message }) => (
                <p className="text-red-500 text-sm mt-1">{message}</p>
              )}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Mật khẩu"
              {...register("password")}
              className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <ErrorMessage
              errors={errors}
              name="password"
              render={({ message }) => (
                <p className="text-red-500 text-sm mt-1">{message}</p>
              )}
            />
            {password && (
              <div className="bg-gray-50 border rounded-lg p-3 mt-2">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Yêu cầu mật khẩu:
                </p>
                <div className="space-y-1 text-xs">
                  <CheckRule ok={password.length >= 8}>
                    Tối thiểu 8 ký tự
                  </CheckRule>
                  <CheckRule ok={/\d/.test(password)}>
                    Chứa ít nhất 1 số
                  </CheckRule>
                  <CheckRule ok={/[A-Z]/.test(password)}>
                    Chứa ít nhất 1 chữ hoa
                  </CheckRule>
                  <CheckRule ok={/[a-z]/.test(password)}>
                    Chứa ít nhất 1 chữ thường
                  </CheckRule>
                  <CheckRule
                    ok={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)}
                  >
                    Chứa ít nhất 1 ký tự đặc biệt
                  </CheckRule>
                </div>
              </div>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Nhập lại Mật khẩu"
              {...register("repassword")}
              className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <ErrorMessage
              errors={errors}
              name="repassword"
              render={({ message }) => (
                <p className="text-red-500 text-sm mt-1">{message}</p>
              )}
            />
          </div>

          {serverError && (
            <p className="text-red-500 text-center text-sm">{serverError}</p>
          )}
          {message && (
            <p className="text-green-600 text-center text-sm">{message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`font-semibold py-2 rounded-lg transition ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed text-gray-700"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>
      </div>
    </div>
  );
}

function CheckRule({
  ok,
  children,
}: {
  ok: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-center ${ok ? "text-green-600" : "text-red-500"}`}
    >
      <span className="mr-2">{ok ? "✓" : "✗"}</span>
      {children}
    </div>
  );
}
