import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { API_BASE_URL } from "../../../config/api";
import { Link } from "react-router-dom";



export default function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/api/users`, {
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

    if (loading) return <div className="p-8 text-center">Carregando usuários...</div>;

    return (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 ">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    Gerenciamento de Usuários
                </h2>
                <Link
                    to="/admin/usuarios/cargos"
                    className="flex items-center gap-2 bg-(--color-primary) text-white font-bold px-4 py-2 rounded-xl text-sm shadow-sm hover:shadow-md hover:bg-(--color-secondary) transition-all cursor-pointer"
                >
                    <Shield size={16} />
                    Gerenciar Cargos
                </Link>
            </div>

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
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max capitalize 
                                        ${u.role === "admin" ? "bg-indigo-100 text-indigo-700" : 
                                          u.role === "user" ? "bg-slate-100 text-slate-600" : 
                                          "bg-emerald-100 text-emerald-700"}
                                    `}>
                                        {u.role === "admin" && <Shield size={14} />}
                                        {u.role === "admin" ? "Administrador" : u.role === "user" ? "Usuário Comum" : u.role}
                                    </span>
                                </td>
                                <td className="py-4 text-right">
                                    <Link
                                        to={`/admin/usuarios/permissoes`}
                                        state={{ userId: u._id }}
                                    >
                                        <button className="text-sm font-bold text-neutral-700 hover:text-(--color-secondary) cursor-pointer
                                            transition-colors bg-(--color-primary)/10 hover:bg-(--color-tertiary)/20 px-4 py-2 rounded-lg">
                                            Gerenciar Permissões
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
