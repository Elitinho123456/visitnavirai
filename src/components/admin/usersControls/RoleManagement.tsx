import { useState, useEffect } from "react";
import { Shield, Trash2 } from "lucide-react";
import { API_BASE_URL } from "../../../config/api";
import { Link } from "react-router-dom";

export default function RoleManagement() {
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/api/roles`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRoles(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const deleteRole = async (id: string, name: string) => {
        if (!window.confirm(`Tem certeza que deseja apagar o cargo '${name}'? Todos os usuários atrelados a ele cairão para 'Usuário Comum'.`)) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/api/roles/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                setRoles((prev) => prev.filter(r => r._id !== id));
                alert("Cargo apagado com sucesso.");
            } else {
                alert("Falha ao apagar o cargo.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Carregando Cargos...</div>;

    return (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col min-h-[50vh]">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Shield className="text-(--color-primary)" />
                        Gestão de Cargos
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Gerencie, exclua e visualize perfis customizados.</p>
                </div>
                {/* O usuário cria variações no UserPerms por enquanto. Podemos só navegar de volta. */}
                <Link
                    to="/admin/usuarios"
                    className="flex items-center gap-2 bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm shadow-sm hover:shadow-md hover:bg-slate-200 transition-all"
                >
                    Voltar aos Usuários
                </Link>
            </div>

            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                            <th className="py-4 px-4 font-bold">Nome do Cargo</th>
                            <th className="py-4 px-4 font-bold">Tipo</th>
                            <th className="py-4 text-right font-bold w-32">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {roles.map((r) => (
                            <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-4 font-bold text-slate-800 capitalize">{r.name}</td>
                                <td className="py-4 px-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold w-max ${r.isSystem ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                        {r.isSystem ? 'Sistema (Imutável)' : 'Customizado'}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-right flex justify-end gap-2">
                                    {r.isSystem ? (
                                        <span className="text-slate-300 text-sm italic py-2">Fixo</span>
                                    ) : (
                                        <button 
                                            onClick={() => deleteRole(r._id, r.name)}
                                            title="Apagar Cargo"
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-8 text-xs text-slate-400 text-center bg-slate-50 p-4 rounded-xl">
                Para editar permissões detalhadas de um cargo ou criar um novo, atribua ou edite os privilégios através do painel "Gerenciar Permissões" de qualquer usuário e clique em <b>Salvar Alterações no Cargo</b>.
            </div>
        </div>
    );
}
