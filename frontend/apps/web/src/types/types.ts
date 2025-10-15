// Shared types for API client functions
export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
  details?: string;
}

export interface UserInfo {
  username: string;
  attributes: Record<string, string>;
}

export interface CheckMeResponse {
  authenticated: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
}

export interface ForgotPasswordData {
  username: string;
}

export interface ConfirmForgotData {
  username: string;
  code: string;
  newPassword: string;
}

export interface ConfirmOtpData {
  username: string;
  code: string;
}

export interface ResendOtpData {
  username: string;
}

export interface VerifyData {
  address: string;
  message: string;
  signature: string;
}
