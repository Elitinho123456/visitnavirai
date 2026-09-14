import { toast } from '@/utils/toast';
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL, apiFetch } from "@/config/api";
import { User, Shield, Save, AlertCircle } from "lucide-react";

const CATEGORIES = [
    { key: "navirai", name: "Naviraí" },
    { key: "where_to_sleep", name: "Onde Dormir" },
    { key: "what_to_visit", name: "O que Visitar" },
    { key: "where_to_eat", name: "Onde Comer" },
    { key: "services", name: "Serviços" },
    { key: "events", name: "Eventos" },
    { key: "sports", name: "Esportes" },
    { key: "users", name: "Usuários" }
];

type Permissions = {
    [key: string]: { read: boolean, create: boolean, edit: boolean, delete: boolean }
};

export default function UserPerms() {
    const location = useLocation();
    const navigate = useNavigate();
    const userId = location.state?.userId;

    const [user, setUser] = useState<any>(null);
    const [roles, setRoles] = useState<any[]>([]);

    // UI State
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

    // Form State
    const [selectedRoleName, setSelectedRoleName] = useState("user");
    const [permissions, setPermissions] = useState<Permissions>({});

    const applyRolePermissions = (roleName: string, availableRoles: any[] = roles) => {
        if (roleName === "custom") {
            setSelectedRoleName("custom");
            return;
        }

        setSelectedRoleName(roleName);

        if (roleName === "admin") {
            const allPerms: Permissions = {};
            CATEGORIES.forEach(c => {
                allPerms[c.key] = { read: true, create: true, edit: true, delete: true };
            });
            setPermissions(allPerms);
            return;
        }

        const roleDef = availableRoles.find(r => r.name === roleName);
        if (roleDef && roleDef.permissions) {
            // Se as permissões vierem como um Map do Mongoose vazio, ou nulo, lidamos com segurança
            const rolePerms = roleDef.permissions;
            const newPerms: Permissions = {};
            CATEGORIES.forEach(c => {
                newPerms[c.key] = rolePerms[c.key] || { read: false, create: false, edit: false, delete: false };
            });
            setPermissions(newPerms);
        } else {
            // Fallback for user or empty role
            const emptyPerms: Permissions = {};
            CATEGORIES.forEach(c => {
                emptyPerms[c.key] = { read: false, create: false, edit: false, delete: false };
            });
            setPermissions(emptyPerms);
        }
    };

    const fetchInitialData = async () => {
        try {
            const token = localStorage.getItem("token");

            // 1. Fetch Roles
            const rolesRes = await apiFetch(`${API_BASE_URL}/api/roles`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            let fetchedRoles = [];
            if (rolesRes.ok) {
                fetchedRoles = await rolesRes.json();
                setRoles(fetchedRoles);
            }

            // 2. Fetch User
            const userRes = await apiFetch(`${API_BASE_URL}/api/users/${userId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (userRes.ok) {
                const userData = await userRes.json();
                setUser(userData);

                // Initialize permissions based on user role
                applyRolePermissions(userData.role || "user", fetchedRoles);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userId) {
            navigate("/admin/usuarios");
            return;
        }
        fetchInitialData();
    }, [userId]);

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        applyRolePermissions(e.target.value);
    };

    const handleCheckboxChange = (categoryKey: string, permKey: 'read' | 'create' | 'edit' | 'delete') => {
        if (selectedRoleName === "admin") return; // Admin is immutable in UI

        if (selectedRoleName === "user") {
            setSelectedRoleName("custom");
        }

        setPermissions(prev => {
            const currentCatPerms = prev[categoryKey] || { read: false, create: false, edit: false, delete: false };
            const nextVal = !currentCatPerms[permKey];

            // Se o usuário desabilitar "Leitura", ele perde todas as outras filhas imediatamente
            if (permKey === 'read' && !nextVal) {
                return {
                    ...prev,
                    [categoryKey]: { read: false, create: false, edit: false, delete: false }
                };
            }

            return {
                ...prev,
                [categoryKey]: {
                    ...currentCatPerms,
                    [permKey]: nextVal
                }
            };
        });
    };

    const handleSaveVariant = async () => {
        handleSaveImpl('new');
    };

    const handleSaveUpdate = async () => {
        handleSaveImpl('update');
    };

    const handleSaveImpl = async (mode: 'new' | 'update') => {
        setSaving(true);
        setMessage(null);
        try {
            const token = localStorage.getItem("token");

            let targetRoleName = selectedRoleName;

            if (mode === 'new' || selectedRoleName === "custom" || selectedRoleName === "user") {
                const checkRes = await apiFetch(`${API_BASE_URL}/api/roles/check`, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                    body: JSON.stringify({ permissions })
                });

                if (checkRes.ok) {
                    const checkData = await checkRes.json();
                    if (checkData.exists) {
                        const useExisting = window.confirm(`Um cargo com estas permissões já existe: "${checkData.role.name}". Deseja aplicar este cargo existente ao usuário?`);
                        if (!useExisting) {
                            setSaving(false);
                            return;
                        }
                        targetRoleName = checkData.role.name;
                    } else {
                        const newRoleName = window.prompt("Digite o nome para este novo esquema de cargo (ex: Editor de Eventos):");
                        if (!newRoleName || newRoleName.trim() === "") {
                            toast.info("O nome do cargo é obrigatório para salvar um modelo customizado.");
                            setSaving(false);
                            return;
                        }

                        const createRes = await apiFetch(`${API_BASE_URL}/api/roles`, {
                            method: "POST",
                            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                            body: JSON.stringify({ name: newRoleName, permissions })
                        });

                        if (!createRes.ok) {
                            const err = await createRes.json();
                            toast.info(`Erro ao criar cargo: ${err.message}`);
                            setSaving(false);
                            return;
                        }

                        const createdRole = await createRes.json();
                        targetRoleName = createdRole.name;
                        
                        setRoles([...roles, createdRole]);
                    }
                }
            } else if (mode === 'update') {
                const roleObj = roles.find(r => r.name === selectedRoleName);
                if (roleObj && !roleObj.isSystem) {
                    const updateRes = await apiFetch(`${API_BASE_URL}/api/roles/${roleObj._id}`, {
                        method: "PUT",
                        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                        body: JSON.stringify({ permissions })
                    });
                    
                    if (!updateRes.ok) {
                        toast.info("Não foi possível atualizar o cargo.");
                        setSaving(false);
                        return;
                    }
                    
                    const updatedRoleData = await updateRes.json();
                    setRoles(roles.map(r => r._id === updatedRoleData._id ? updatedRoleData : r));
                }
            }

            // Agora aplica o cargo validado ao usuário alvo
            const assignRes = await apiFetch(`${API_BASE_URL}/api/users/${userId}/role`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ role: targetRoleName })
            });

            if (assignRes.ok) {
                const updatedUser = await assignRes.json();
                setUser(updatedUser);
                setSelectedRoleName(updatedUser.role);
                setMessage({ type: "success", text: "Permissões atualizadas com sucesso!" });
            } else {
                setMessage({ type: "error", text: "Erro ao atualizar cargo do usuário no banco." });
            }

        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: "Erro na conexão ou na operação." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-[#8a7968] font-medium animate-pulse">Carregando permissões do sistema...</div>;

    const isAdminSelected = selectedRoleName === "admin";

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Bloco de Boas-vindas */}
            <div className="bg-white dark:bg-[#241a06] rounded-2xl p-6 md:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-[#ede0d8] dark:border-[#3a2e1a] relative overflow-hidden">
                <div className="relative z-10 md:w-2/3">
                    <h3 className="text-2xl font-black text-[#241a06] dark:text-[#f0e6d6] mb-3 flex items-center gap-2">
                        <Shield className="text-(--color-primary)" />
                        Permissões e Cargos
                    </h3>
                    <p className="text-[#5a4d3e] dark:text-[#f0e6d6] text-sm md:text-base leading-relaxed">
                        Gerencie as permissões de acesso do usuário. Você pode escolher um cargo já existente, ou definir permissões granulares por página e salvá-las como um novo Cargo.
                    </p>
                </div>
                <div className="absolute -right-10 -bottom-20 opacity-5 pointer-events-none hidden md:block">
                    <User size={300} className="text-(--color-primary)" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Coluna Esquerda: Info Usuário e Seletor de Cargo */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-[#241a06] rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-[#ede0d8] dark:border-[#3a2e1a]">
                        <h4 className="font-bold text-[#241a06] dark:text-[#f0e6d6] border-b border-[#ede0d8] dark:border-[#3a2e1a] pb-3 mb-4">Informações</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-[#8a7968] dark:text-[#c5b49e] uppercase">Nome</label>
                                <p className="text-sm font-medium text-[#241a06] dark:text-[#f0e6d6]">{user?.name}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-[#8a7968] dark:text-[#c5b49e] uppercase">Email</label>
                                <p className="text-sm text-[#5a4d3e] dark:text-[#f0e6d6] truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#241a06] rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-[#ede0d8] dark:border-[#3a2e1a]">
                        <h4 className="font-bold text-[#241a06] dark:text-[#f0e6d6] border-b border-[#ede0d8] dark:border-[#3a2e1a] pb-3 mb-4">Cargo Autoral</h4>
                        <select
                            value={selectedRoleName}
                            onChange={handleRoleChange}
                            className="w-full bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-(--color-primary)/50 focus:border-(--color-primary) outline-none transition-all"
                        >
                            <option disabled className="font-bold text-[#241a06] dark:text-[#f0e6d6] bg-[#ede0d8] dark:bg-[#241a06] uppercase tracking-widest text-[10px]">--- Cargos do Sistema ---</option>
                            <option value="admin">Administrador (Acesso Total)</option>
                            <option value="user">Usuário Básico</option>
                            
                            {roles.filter(r => !r.isSystem).length > 0 && (
                                <>
                                    <option disabled className="font-bold text-[#241a06] dark:text-[#f0e6d6] bg-[#ede0d8] dark:bg-[#241a06] uppercase tracking-widest text-[10px] mt-2">--- Cargos Personalizados ---</option>
                                    {roles.filter(r => !r.isSystem).map(r => (
                                        <option key={r._id} value={r.name}>{r.name}</option>
                                    ))}
                                </>
                            )}
                            <option disabled className="font-bold text-[#241a06] dark:text-[#f0e6d6] bg-[#ede0d8] dark:bg-[#241a06] mt-2">--- Avançado ---</option>
                            <option value="custom" disabled className="italic">✦ Esquema Customizado ✦</option>
                        </select>
                        {isAdminSelected && (
                            <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-lg flex gap-2 items-start text-indigo-700 dark:text-indigo-300 text-xs shadow-inner">
                                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                                <p>O cargo <strong>Administrador</strong> possui todas as permissões liberadas de forma irreversível e inalterável nesta área.</p>
                            </div>
                        )}
                        {selectedRoleName === "custom" ? (
                            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-lg text-amber-800 dark:text-amber-300 text-xs shadow-inner">
                                Preenchido manualmente. Solicitará um "Nome" para ser salvo como nova variação.
                            </div>
                        ) : !isAdminSelected && selectedRoleName !== "user" ? (
                            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-lg text-emerald-700 dark:text-emerald-300 text-xs shadow-inner">
                                Você está editando um cargo customizado global.
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Coluna Direita: Grid de Permissões */}
                <div className="lg:col-span-3 bg-white dark:bg-[#241a06] rounded-2xl p-6 md:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-[#ede0d8] dark:border-[#3a2e1a]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h1 className="text-xl font-bold text-[#241a06] dark:text-[#f0e6d6]">Matriz de Acessos</h1>
                        <div className="flex flex-col sm:flex-row gap-2">
                            {(!isAdminSelected && selectedRoleName !== "custom" && selectedRoleName !== "user") && (
                                <button
                                    disabled={saving}
                                    onClick={handleSaveUpdate}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all bg-(--color-primary) text-white hover:bg-(--color-secondary) hover:shadow-md active:scale-95 cursor-pointer"
                                    title="Atualiza o cargo em si, impactando todos os usuários que compartilham desta Role."
                                >
                                    {saving ? <span className="animate-spin border-2 border-white/20 border-t-white rounded-full w-4 h-4" /> : <Save size={16} />}
                                    Sobrescrever Role Existente
                                </button>
                            )}

                            <button
                                disabled={saving || isAdminSelected}
                                onClick={handleSaveVariant}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer
                                    ${isAdminSelected
                                        ? 'bg-[#ede0d8] dark:bg-[#2e2310] text-[#8a7968] cursor-not-allowed'
                                        : (selectedRoleName !== "custom" && selectedRoleName !== "user") 
                                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:shadow-md active:scale-95 border border-emerald-200 dark:border-emerald-800' 
                                            : 'bg-(--color-primary) text-white hover:bg-(--color-secondary) hover:shadow-md active:scale-95'}`}
                            >
                                {saving ? <span className="animate-spin border-2 border-current border-t-transparent rounded-full w-4 h-4" /> : <Save size={16} />}
                                {(selectedRoleName !== "custom" && selectedRoleName !== "user") ? "Salvar como Duplicata" : "Salvar Permissões"}
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="overflow-x-auto ring-1 ring-[#ede0d8] dark:ring-[#3a2e1a] rounded-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#faf5f0] dark:bg-[#1a1208] border-b border-[#ede0d8] dark:border-[#3a2e1a] text-[#5a4d3e] dark:text-[#f0e6d6] text-xs uppercase tracking-wider">
                                    <th className="py-4 px-6 font-bold w-1/3">Módulos do Sistema</th>
                                    <th className="py-4 px-4 font-bold text-center">Leitura</th>
                                    <th className="py-4 px-4 font-bold text-center">Adicionar</th>
                                    <th className="py-4 px-4 font-bold text-center">Editar</th>
                                    <th className="py-4 px-4 font-bold text-center">Remover</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#ede0d8] dark:divide-[#3a2e1a]">
                                {CATEGORIES.map(cat => {
                                    const catPerms = permissions[cat.key] || { read: false, create: false, edit: false, delete: false };
                                    return (
                                        <tr key={cat.key} className="hover:bg-[#f5ede5]/50 dark:hover:bg-[#2e2310]/50 transition-colors">
                                            <td className="py-4 px-6 text-[#241a06] dark:text-[#f0e6d6] font-medium text-sm">
                                                {cat.name}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={catPerms.read}
                                                    onChange={() => handleCheckboxChange(cat.key, 'read')}
                                                    disabled={isAdminSelected}
                                                    className="w-5 h-5 rounded border-[#ede0d8] dark:border-[#3a2e1a] text-(--color-primary) focus:ring-(--color-primary)/50 bg-[#faf5f0] dark:bg-[#2e2310] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                />
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={catPerms.create}
                                                    onChange={() => handleCheckboxChange(cat.key, 'create')}
                                                    disabled={isAdminSelected || !catPerms.read}
                                                    className={`w-5 h-5 rounded border-[#ede0d8] dark:border-[#3a2e1a] text-(--color-primary) focus:ring-(--color-primary)/50 bg-[#faf5f0] dark:bg-[#2e2310] cursor-pointer disabled:opacity-50 ${!catPerms.read && !isAdminSelected ? "cursor-not-allowed opacity-30" : "disabled:cursor-not-allowed"}`}
                                                />
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={catPerms.edit}
                                                    onChange={() => handleCheckboxChange(cat.key, 'edit')}
                                                    disabled={isAdminSelected || !catPerms.read}
                                                    className={`w-5 h-5 rounded border-[#ede0d8] dark:border-[#3a2e1a] text-(--color-primary) focus:ring-(--color-primary)/50 bg-[#faf5f0] dark:bg-[#2e2310] cursor-pointer disabled:opacity-50 ${!catPerms.read && !isAdminSelected ? "cursor-not-allowed opacity-30" : "disabled:cursor-not-allowed"}`}
                                                />
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={catPerms.delete}
                                                    onChange={() => handleCheckboxChange(cat.key, 'delete')}
                                                    disabled={isAdminSelected || !catPerms.read}
                                                    className={`w-5 h-5 rounded border-[#ede0d8] dark:border-[#3a2e1a] text-(--color-primary) focus:ring-(--color-primary)/50 bg-[#faf5f0] dark:bg-[#2e2310] cursor-pointer disabled:opacity-50 ${!catPerms.read && !isAdminSelected ? "cursor-not-allowed opacity-30" : "disabled:cursor-not-allowed"}`}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}