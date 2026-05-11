import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function PublicRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
                <div className="animate-spin w-10 h-10 border-4 border-(--color-primary) border-t-transparent rounded-full shadow-lg"></div>
            </div>
        );
    }

    if (user) {
        if (user.role === "user") {
            return <Navigate to="/" replace />;
        } else {
            return <Navigate to="/admin" replace />;
        }
    }

    return <Outlet />;
}
