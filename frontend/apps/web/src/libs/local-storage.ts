export const saveAuth = (
  token: string,
  refreshToken: string,
  idToken: string
) => {
  localStorage.setItem("accessToken", token);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("idToken", idToken);
};

export const clearAuth = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("idToken");
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};
