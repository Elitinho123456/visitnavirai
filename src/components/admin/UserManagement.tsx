import { useState, useEffect } from "react";
import { Shield, ShieldAlert, Check, X } from "lucide-react";

export default function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmId, setConfirmId] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:${import.meta.env.VITE_API_PORT}/api/users`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handlePromote = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:${import.meta.env.VITE_API_PORT}/api/users/${id}/promote`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                alert("Usuário promovido a Admin com sucesso!");
                setConfirmId(null);
                fetchUsers();
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao promover usuário.");
        }
    };

    if (loading) return <div className="p-8 text-center">Carregando usuários...</div>;

    return (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 ">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">
                Gerenciamento de Usuários
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                            <th className="py-4 font-bold">Nome</th>
                            <th className="py-4 font-bold">Email</th>
                            <th className="py-4 font-bold">Cargo</th>
                            <th className="py-4 font-bold text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((u) => (
                            <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 text-gray-900 font-medium">{u.name}</td>
                                <td className="py-4 text-gray-500 ">{u.email}</td>
                                <td className="py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max ${u.role === "admin" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600 "}`}>
                                        {u.role === "admin" && <Shield size={14} />}
                                        {u.role === "admin" ? "Administrador" : "Usuário Comum"}
                                    </span>
                                </td>
                                <td className="py-4 text-right">
                                    {u.role !== "admin" && (
                                        confirmId === u._id ? (
                                            <div className="flex items-center justify-end gap-2 animate-in fade-in slide-in-from-right-2">
                                                <span className="text-sm font-bold text-red-500 mr-2 flex items-center gap-1">
                                                    <ShieldAlert size={16} /> Tem certeza?
                                                </span>
                                                <button onClick={() => handlePromote(u._id)} className="p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg" title="Confirmar">
                                                    <Check size={18} />
                                                </button>
                                                <button onClick={() => setConfirmId(null)} className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg" title="Cancelar">
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setConfirmId(u._id)}
                                                className="text-sm font-bold text-(--color-secondary) hover:text-(--color-primary) transition-colors bg-(--color-primary)/10 hover:bg-(--color-primary)/20 px-4 py-2 rounded-lg"
                                            >
                                                Promover a Admin
                                            </button>
                                        )
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
