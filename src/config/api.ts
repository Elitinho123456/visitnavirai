import { toast } from '../utils/toast';

const apiPort = import.meta.env.VITE_API_PORT || "3000";
const apiProtocol = (import.meta.env.VITE_API_PROTOCOL || "http").replace(":", "");
const configuredUrl = (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "");
const configuredHost = (import.meta.env.VITE_API_HOST || "auto").trim();

const runtimeHost = typeof window !== "undefined" ? window.location.hostname : "localhost";
const apiHost = configuredHost && configuredHost !== "auto" ? configuredHost : (runtimeHost || "localhost");

export const API_BASE_URL = configuredUrl || `${apiProtocol}://${apiHost}:${apiPort}`;

/**
 * Wrapper for the native fetch API that intercepts 401 responses.
 * If a 401 is detected, it clears the token and redirects to login.
 */
export const apiFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    // Injeta o token automaticamente quando a chamada não definiu Authorization
    // (ex.: uploads de imagem, que agora exigem login no backend).
    const token = localStorage.getItem('token');
    const headers = new Headers(init?.headers);
    if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(input, { ...init, headers });
    
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
