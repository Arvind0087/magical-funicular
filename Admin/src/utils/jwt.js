import { PATH_AUTH } from "routes/paths";

function JWTDecode(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export const IsValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }
  const decoded = JWTDecode(accessToken);
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};

export const TokenExpired = (exp) => {
  let expiredTimer;
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;
  clearTimeout(expiredTimer);
  expiredTimer = setTimeout(() => {
    localStorage.removeItem("accessToken");
    window.location.href = PATH_AUTH.login;
  }, timeLeft);
};
