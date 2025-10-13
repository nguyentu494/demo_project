"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const router = useRouter();

  const validatePassword = (password: string) => {
    const errors: string[] = [];

    if (!/\d/.test(password)) {
      errors.push("Chứa ít nhất 1 số");
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("Chứa ít nhất 1 ký tự đặc biệt");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Chứa ít nhất 1 chữ cái viết hoa");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Chứa ít nhất 1 chữ cái viết thường");
    }

    if (password.length < 8) {
      errors.push("Tối thiểu 8 ký tự");
    }

    return errors;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword) {
      const errors = validatePassword(newPassword);
      setPasswordErrors(errors);
    } else {
      setPasswordErrors([]);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const errors = validatePassword(password);
    if (errors.length > 0) {
      setError("Mật khẩu không đáp ứng yêu cầu bảo mật.");
      return;
    }

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
          <div className="space-y-2">
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={handlePasswordChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              required
            />

            {/* Password Requirements */}
            {password && (
              <div className="bg-gray-50 border rounded-lg p-3">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Yêu cầu mật khẩu:
                </p>
                <div className="space-y-1">
                  <div
                    className={`flex items-center text-xs ${
                      password.length >= 8 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    <span className="mr-2">
                      {password.length >= 8 ? "✓" : "✗"}
                    </span>
                    Tối thiểu 8 ký tự
                  </div>
                  <div
                    className={`flex items-center text-xs ${
                      /\d/.test(password) ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    <span className="mr-2">
                      {/\d/.test(password) ? "✓" : "✗"}
                    </span>
                    Chứa ít nhất 1 số
                  </div>
                  <div
                    className={`flex items-center text-xs ${
                      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    <span className="mr-2">
                      {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
                        ? "✓"
                        : "✗"}
                    </span>
                    Chứa ít nhất 1 ký tự đặc biệt
                  </div>
                  <div
                    className={`flex items-center text-xs ${
                      /[A-Z]/.test(password) ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    <span className="mr-2">
                      {/[A-Z]/.test(password) ? "✓" : "✗"}
                    </span>
                    Chứa ít nhất 1 chữ cái viết hoa
                  </div>
                  <div
                    className={`flex items-center text-xs ${
                      /[a-z]/.test(password) ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    <span className="mr-2">
                      {/[a-z]/.test(password) ? "✓" : "✗"}
                    </span>
                    Chứa ít nhất 1 chữ cái viết thường
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          {message && (
            <p className="text-green-600 text-center text-sm">{message}</p>
          )}

          <button
            type="submit"
            disabled={passwordErrors.length > 0 && password.length > 0}
            className={`font-semibold py-2 rounded-lg transition ${
              passwordErrors.length > 0 && password.length > 0
                ? "bg-gray-400 cursor-not-allowed text-gray-600"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
}
