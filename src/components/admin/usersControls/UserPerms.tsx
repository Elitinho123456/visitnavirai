import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config/api";
import { User, Shield, Save, AlertCircle } from "lucide-react";

const CATEGORIES = [
    { key: "navirai", name: "Naviraí" },
    { key: "where_to_sleep", name: "Onde Dormir" },
    { key: "what_to_visit", name: "O que Visitar" },
    { key: "where_to_eat", name: "Onde Comer" },
    { key: "services", name: "Serviços" },
    { key: "events", name: "Eventos" },
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

    const fetchInitialData = async () => {
        try {
            const token = localStorage.getItem("token");

            // 1. Fetch Roles
            const rolesRes = await fetch(`${API_BASE_URL}/api/roles`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            let fetchedRoles = [];
            if (rolesRes.ok) {
                fetchedRoles = await rolesRes.json();
                setRoles(fetchedRoles);
            }

            // 2. Fetch User
            const userRes = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
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
                const checkRes = await fetch(`${API_BASE_URL}/api/roles/check`, {
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
                            alert("O nome do cargo é obrigatório para salvar um modelo customizado.");
                            setSaving(false);
                            return;
                        }

                        const createRes = await fetch(`${API_BASE_URL}/api/roles`, {
                            method: "POST",
                            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                            body: JSON.stringify({ name: newRoleName, permissions })
                        });

                        if (!createRes.ok) {
                            const err = await createRes.json();
                            alert(`Erro ao criar cargo: ${err.message}`);
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
                    const updateRes = await fetch(`${API_BASE_URL}/api/roles/${roleObj._id}`, {
                        method: "PUT",
                        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                        body: JSON.stringify({ permissions })
                    });
                    
                    if (!updateRes.ok) {
                        alert("Não foi possível atualizar o cargo.");
                        setSaving(false);
                        return;
                    }
                    
                    const updatedRoleData = await updateRes.json();
                    setRoles(roles.map(r => r._id === updatedRoleData._id ? updatedRoleData : r));
                }
            }

            // Agora aplica o cargo validado ao usuário alvo
            const assignRes = await fetch(`${API_BASE_URL}/api/users/${userId}/role`, {
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

    if (loading) return <div className="p-8 text-center text-slate-500 font-medium animate-pulse">Carregando permissões do sistema...</div>;

    const isAdminSelected = selectedRoleName === "admin";

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Bloco de Boas-vindas */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 relative overflow-hidden">
                <div className="relative z-10 md:w-2/3">
                    <h3 className="text-2xl font-black text-slate-800 mb-3 flex items-center gap-2">
                        <Shield className="text-(--color-primary)" />
                        Permissões e Cargos
                    </h3>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">
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
                    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
                        <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Informações</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase">Nome</label>
                                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
                                <p className="text-sm text-slate-600 truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
                        <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Cargo Autoral</h4>
                        <select
                            value={selectedRoleName}
                            onChange={handleRoleChange}
                            className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-(--color-primary)/50 focus:border-(--color-primary) outline-none transition-all"
                        >
                            <option disabled className="font-bold text-slate-800 bg-slate-100 uppercase tracking-widest text-[10px]">--- Cargos do Sistema ---</option>
                            <option value="admin">Administrador (Acesso Total)</option>
                            <option value="user">Usuário Básico</option>
                            
                            {roles.filter(r => !r.isSystem).length > 0 && (
                                <>
                                    <option disabled className="font-bold text-slate-800 bg-slate-100 uppercase tracking-widest text-[10px] mt-2">--- Cargos Personalizados ---</option>
                                    {roles.filter(r => !r.isSystem).map(r => (
                                        <option key={r._id} value={r.name}>{r.name}</option>
                                    ))}
                                </>
                            )}
                            <option disabled className="font-bold text-slate-800 bg-slate-100 mt-2">--- Avançado ---</option>
                            <option value="custom" disabled className="italic">✦ Esquema Customizado ✦</option>
                        </select>
                        {isAdminSelected && (
                            <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex gap-2 items-start text-indigo-700 text-xs shadow-inner">
                                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                                <p>O cargo <strong>Administrador</strong> possui todas as permissões liberadas de forma irreversível e inalterável nesta área.</p>
                            </div>
                        )}
                        {selectedRoleName === "custom" ? (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 text-xs shadow-inner">
                                Preenchido manualmente. Solicitará um "Nome" para ser salvo como nova variação.
                            </div>
                        ) : !isAdminSelected && selectedRoleName !== "user" ? (
                            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700 text-xs shadow-inner">
                                Você está editando um cargo customizado global.
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Coluna Direita: Grid de Permissões */}
                <div className="lg:col-span-3 bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h1 className="text-xl font-bold text-slate-800">Matriz de Acessos</h1>
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
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : (selectedRoleName !== "custom" && selectedRoleName !== "user") 
                                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:shadow-md active:scale-95 border border-emerald-200' 
                                            : 'bg-(--color-primary) text-white hover:bg-(--color-secondary) hover:shadow-md active:scale-95'}`}
                            >
                                {saving ? <span className="animate-spin border-2 border-current border-t-transparent rounded-full w-4 h-4" /> : <Save size={16} />}
                                {(selectedRoleName !== "custom" && selectedRoleName !== "user") ? "Salvar como Duplicata" : "Salvar Permissões"}
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="overflow-x-auto ring-1 ring-slate-100 rounded-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs uppercase tracking-wider">
                                    <th className="py-4 px-6 font-bold w-1/3">Módulos do Sistema</th>
                                    <th className="py-4 px-4 font-bold text-center">Leitura</th>
                                    <th className="py-4 px-4 font-bold text-center">Adicionar</th>
                                    <th className="py-4 px-4 font-bold text-center">Editar</th>
                                    <th className="py-4 px-4 font-bold text-center">Remover</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {CATEGORIES.map(cat => {
                                    const catPerms = permissions[cat.key] || { read: false, create: false, edit: false, delete: false };
                                    return (
                                        <tr key={cat.key} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 px-6 text-slate-800 font-medium text-sm">
                                                {cat.name}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={catPerms.read}
                                                    onChange={() => handleCheckboxChange(cat.key, 'read')}
                                                    disabled={isAdminSelected}
                                                    className="w-5 h-5 rounded border-slate-300 text-(--color-primary) focus:ring-(--color-primary)/50 bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                />
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={catPerms.create}
                                                    onChange={() => handleCheckboxChange(cat.key, 'create')}
                                                    disabled={isAdminSelected || !catPerms.read}
                                                    className={`w-5 h-5 rounded border-slate-300 text-(--color-primary) focus:ring-(--color-primary)/50 bg-slate-50 cursor-pointer disabled:opacity-50 ${!catPerms.read && !isAdminSelected ? "cursor-not-allowed opacity-30" : "disabled:cursor-not-allowed"}`}
                                                />
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={catPerms.edit}
                                                    onChange={() => handleCheckboxChange(cat.key, 'edit')}
                                                    disabled={isAdminSelected || !catPerms.read}
                                                    className={`w-5 h-5 rounded border-slate-300 text-(--color-primary) focus:ring-(--color-primary)/50 bg-slate-50 cursor-pointer disabled:opacity-50 ${!catPerms.read && !isAdminSelected ? "cursor-not-allowed opacity-30" : "disabled:cursor-not-allowed"}`}
                                                />
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={catPerms.delete}
                                                    onChange={() => handleCheckboxChange(cat.key, 'delete')}
                                                    disabled={isAdminSelected || !catPerms.read}
                                                    className={`w-5 h-5 rounded border-slate-300 text-(--color-primary) focus:ring-(--color-primary)/50 bg-slate-50 cursor-pointer disabled:opacity-50 ${!catPerms.read && !isAdminSelected ? "cursor-not-allowed opacity-30" : "disabled:cursor-not-allowed"}`}
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