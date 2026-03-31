const apiPort = import.meta.env.VITE_API_PORT || "3000";
const apiProtocol = (import.meta.env.VITE_API_PROTOCOL || "http").replace(":", "");
const configuredHost = (import.meta.env.VITE_API_HOST || "auto").trim();

const runtimeHost = typeof window !== "undefined" ? window.location.hostname : "localhost";
const apiHost = configuredHost && configuredHost !== "auto" ? configuredHost : (runtimeHost || "localhost");

export const API_BASE_URL = `${apiProtocol}://${apiHost}:${apiPort}`;