import { toast } from '../utils/toast';

const apiPort = import.meta.env.VITE_API_PORT || "3000";
const apiProtocol = (import.meta.env.VITE_API_PROTOCOL || "http").replace(":", "");
const configuredHost = (import.meta.env.VITE_API_HOST || "auto").trim();

const runtimeHost = typeof window !== "undefined" ? window.location.hostname : "localhost";
const apiHost = configuredHost && configuredHost !== "auto" ? configuredHost : (runtimeHost || "localhost");

export const API_BASE_URL = `${apiProtocol}://${apiHost}:${apiPort}`;

/**
 * Wrapper for the native fetch API that intercepts 401 responses.
 * If a 401 is detected, it clears the token and redirects to login.
 */
export const apiFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    // Inject token if available (optional, but good practice if you want it centralized)
    // For now we just pass through what was requested, and only intercept the response.
    
    const response = await fetch(input, init);
    
    if (response.status === 401) {
        if (window.location.pathname !== '/login') {
            toast.error("Sua sessão expirou. Faça login novamente.");
            localStorage.removeItem('token');
            // Redireciona após um curto atraso para permitir que o toast seja lido, 
            // ou redireciona imediatamente se preferir.
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
        }
    }
    
    return response;
};