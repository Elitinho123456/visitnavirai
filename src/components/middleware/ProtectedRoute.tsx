import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));

        if (decoded.role !== "admin") {
            return <Navigate to="/" replace />;
        }
    } catch (error) {
        // Token inválido
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
