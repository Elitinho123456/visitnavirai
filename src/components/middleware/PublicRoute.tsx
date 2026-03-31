import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
    const token = localStorage.getItem("token");

    if (token) {
        try {
            const payload = token.split(".")[1];
            const decoded = JSON.parse(atob(payload));

            if (decoded.role === "user") {
                return <Navigate to="/" replace />;
            } else {
                return <Navigate to="/admin" replace />;
            }
        } catch (error) {
            localStorage.removeItem("token");
        }
    }

    return <Outlet />;
}
