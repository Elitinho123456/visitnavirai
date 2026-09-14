import { toast } from '@/utils/toast';
import { useState, useEffect } from "react";
import { Shield, Trash2 } from "lucide-react";
import { API_BASE_URL, apiFetch } from "@/config/api";
import { Link } from "react-router-dom";

export default function RoleManagement() {
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await apiFetch(`${API_BASE_URL}/api/roles`, {
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
            const res = await apiFetch(`${API_BASE_URL}/api/roles/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                setRoles((prev) => prev.filter(r => r._id !== id));
                toast.info("Cargo apagado com sucesso.");
            } else {
                toast.info("Falha ao apagar o cargo.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="p-8 text-center text-[#8a7968]">Carregando Cargos...</div>;

    return (
        <div className="bg-white dark:bg-[#241a06] rounded-2xl p-6 md:p-8 shadow-sm border border-[#ede0d8] dark:border-[#3a2e1a] flex flex-col min-h-[50vh]">
            <div className="flex justify-between items-center mb-6 border-b border-[#ede0d8] dark:border-[#3a2e1a] pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#241a06] dark:text-[#f0e6d6] flex items-center gap-2">
                        <Shield className="text-(--color-primary)" />
                        Gestão de Cargos
                    </h2>
                    <p className="text-[#8a7968] dark:text-[#c5b49e] text-sm mt-1">Gerencie, exclua e visualize perfis customizados.</p>
                </div>
                {/* O usuário cria variações no UserPerms por enquanto. Podemos só navegar de volta. */}
                <Link
                    to="/admin/usuarios"
                    className="flex items-center gap-2 bg-[#f5ede5] dark:bg-[#2e2310] text-[#5a4d3e] dark:text-[#c5b49e] font-bold px-4 py-2 rounded-xl text-sm shadow-sm hover:shadow-md hover:bg-[#ede0d8] dark:hover:bg-[#3a2e1a] transition-all"
                >
                    Voltar aos Usuários
                </Link>
            </div>

            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#ede0d8] dark:border-[#3a2e1a] text-[#8a7968] dark:text-[#c5b49e] text-sm uppercase tracking-wider">
                            <th className="py-4 px-4 font-bold">Nome do Cargo</th>
                            <th className="py-4 px-4 font-bold">Tipo</th>
                            <th className="py-4 text-right font-bold w-32">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ede0d8] dark:divide-[#3a2e1a]">
                        {roles.map((r) => (
                            <tr key={r._id} className="hover:bg-[#f5ede5]/50 dark:hover:bg-[#2e2310] transition-colors">
                                <td className="py-4 px-4 font-bold text-[#241a06] dark:text-[#f0e6d6] capitalize">{r.name}</td>
                                <td className="py-4 px-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold w-max ${r.isSystem ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'}`}>
                                        {r.isSystem ? 'Sistema (Imutável)' : 'Customizado'}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-right flex justify-end gap-2">
                                    {r.isSystem ? (
                                        <span className="text-[#8a7968]/50 dark:text-[#c5b49e]/40 text-sm italic py-2">Fixo</span>
                                    ) : (
                                        <button 
                                            onClick={() => deleteRole(r._id, r.name)}
                                            title="Apagar Cargo"
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 hover:bg-red-500 dark:hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
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
            <div className="mt-8 text-xs text-[#8a7968] dark:text-[#c5b49e] text-center bg-[#f5ede5] dark:bg-[#1a1208] p-4 rounded-xl border border-[#ede0d8] dark:border-[#3a2e1a]">
                Para editar permissões detalhadas de um cargo ou criar um novo, atribua ou edite os privilégios através do painel "Gerenciar Permissões" de qualquer usuário e clique em <b>Salvar Alterações no Cargo</b>.
            </div>
        </div>
    );
}
