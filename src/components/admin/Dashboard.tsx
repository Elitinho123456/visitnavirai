import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import { LayoutDashboard, Users, Hotel, Calendar, LogOut, Menu, X, TrendingUp, TrendingDown, Home, AlertOctagon, Camera } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../../config/api";

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<{ id: string, name: string, email: string, role?: string, permissions?: any, profileImage?: string } | null>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [greeting, setGreeting] = useState("Bem-vindo");

    useEffect(() => {
        // Lógica de Saudação Dinâmica
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Bom dia");
        else if (hour < 18) setGreeting("Boa tarde");
        else setGreeting("Boa noite");

        // Decodificando Token
        const token = localStorage.getItem("token");
        async function fecthUser() {
            if (token) {
                try {
                    const payload = token.split(".")[1];
                    const decoded = JSON.parse(atob(payload));
                    const res = await fetch(`${API_BASE_URL}/api/users/${decoded.id}`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    const data = await res.json();
                    setUser({ id: decoded.id, name: data.name, email: data.email, role: data.role, permissions: data.permissions, profileImage: data.profileImage });
                } catch (e) {
                    console.error("Erro ao ler token:", e);
                } finally {
                    setLoadingUser(false);
                }
            } else {
                setLoadingUser(false);
                navigate("/login");
            }
        }
        fecthUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const rawNavItems = [
        { path: "/admin", icon: LayoutDashboard, label: "Visão Geral", categoryKey: "all" },
        { path: "/admin/usuarios", icon: Users, label: "Usuários", categoryKey: "users" },
        { path: "/admin/hoteis", icon: Hotel, label: "Onde Dormir", categoryKey: "where_to_sleep" },
        { path: "/admin/eventos", icon: Calendar, label: "Eventos Locais", categoryKey: "events" }
    ];

    const navItems = rawNavItems.filter(item => {
        if (item.categoryKey === "all") return true;
        if (user?.role === "admin") return true;

        // Bloqueio Hierárquico: Usuários SÓ pode ser lida por admin literal
        if (item.categoryKey === "users") return false;

        if (!user?.role || user?.role === "user") return false;
        return user?.permissions && user.permissions[item.categoryKey]?.read === true;
    });

    // Lógica para Upload da Foto de Perfil
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploadingAvatar(true);
        try {
            const token = localStorage.getItem("token");

            // 1. Enviar para a rota genérica de uploads
            const fd = new FormData();
            fd.append("category", "Perfil");
            fd.append("name", user.name);
            fd.append("file", file);

            const uploadRes = await fetch(`${API_BASE_URL}/api/imgs/upload`, {
                method: "POST",
                body: fd
            });

            if (!uploadRes.ok) throw new Error("Erro no upload físico da imagem.");
            const { url } = await uploadRes.json();

            // 2. Atualizar o cadastro do usuário
            const updateRes = await fetch(`${API_BASE_URL}/api/users/${user.id}/profile-image`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ profileImage: url })
            });

            if (!updateRes.ok) throw new Error("Erro ao salvar url no cadastro.");

            setUser(prev => prev ? { ...prev, profileImage: url } : null);
        } catch (error) {
            console.error("Erro ao fazer upload da avatar:", error);
            alert("Não foi possível atualizar sua foto de perfil.");
        } finally {
            setUploadingAvatar(false);
            if (fileInputRef.current) fileInputRef.current.value = ""; // reseta o input
        }
    };

    // Fecha a sidebar no mobile ao clicar em um link
    const closeSidebarMobile = () => {
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans selection:bg-(--color-primary) selection:text-white">

            {/* Overlay Mobile */}
            {isSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed md:relative z-50 h-full w-280px bg-white border-r border-slate-200 shadow-2xl md:shadow-none
                    transition-transform duration-300 ease-in-out flex flex-col
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >
                <div className="flex items-center justify-between p-6 h-20 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-(--color-primary) flex items-center justify-center text-white font-black text-xl shadow-lg shadow-(--color-primary)/30">
                            N
                        </div>
                        <h1 className="text-xl font-black text-slate-800 tracking-tight">
                            Admin<span className="text-(--color-primary)">Naviraí</span>
                        </h1>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 py-6 customized-scrollbar">
                    <div className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest px-4">Menu Principal</div>
                    <nav className="space-y-1.5">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path ||
                                (item.path !== '/admin' && location.pathname.startsWith(item.path));
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={closeSidebarMobile}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-semibold text-sm group relative overflow-hidden
                                        ${isActive
                                            ? "text-(--color-primary) bg-(--color-primary)/5 shadow-sm shadow-(--color-primary)/5 border border-(--color-primary)/10"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                                    `}
                                >
                                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-(--color-primary) rounded-r-full" />}
                                    <item.icon size={20} className={`transition-transform duration-300 ${isActive ? "text-(--color-primary)" : "text-slate-400 group-hover:text-slate-600 group-hover:scale-110"}`} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <label htmlFor="perfil" className="hidden">Perfil</label>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-3 mb-4 p-2 rounded-xl bg-white border border-slate-200 shadow-sm cursor-pointer hover:border-(--color-primary)/50 hover:shadow-md transition-all group"
                        title="Alterar foto de perfil"
                    >
                        <div className="w-10 h-10 rounded-full bg-linear-to-tr from-(--color-secondary) to-(--color-primary) text-white flex items-center justify-center font-bold text-lg shadow-inner relative overflow-hidden shrink-0">
                            {uploadingAvatar ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : user?.profileImage ? (
                                <img src={`${API_BASE_URL}${user.profileImage}`} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.charAt(0).toUpperCase() || "A"
                            )}
                            {/* Overlay de Hover */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera size={16} className="text-white" />
                            </div>
                        </div>
                        <div className="overflow-hidden flex-1">
                            <p className="text-sm font-bold text-slate-900 truncate group-hover:text-(--color-primary) transition-colors">{user?.name || "Administrador"}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    {/* Input invisível disparado pelo clique */}
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleAvatarUpload}
                        className="hidden"
                    />
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-200 transition-colors font-bold text-sm border border-transparent hover:border-red-100 cursor-pointer"
                    >
                        <LogOut size={18} />
                        Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

                {/* Header Top Bar (Glassmorphism) */}
                <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-4 md:px-8 z-30 shrink-0 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm"
                        >
                            <Menu size={20} />
                        </button>

                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-slate-800 hidden md:block tracking-tight">
                                {navItems.find(i => i.path === location.pathname || (i.path !== '/admin' && location.pathname.startsWith(i.path)))?.label || "Painel de Controle"}
                            </h2>
                            <p className="text-sm text-slate-500 font-medium md:hidden">
                                {navItems.find(i => i.path === location.pathname || (i.path !== '/admin' && location.pathname.startsWith(i.path)))?.label || "Painel"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-bold text-slate-800">{greeting}, {user?.name?.split(' ')[0] || "Admin"} 👋</p>
                            <p className="text-xs text-slate-500 font-medium">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                        </div>
                        <Link to="/" className="relative p-2.5 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-(--color-primary) hover:border-(--color-primary)/30 transition-all shadow-sm">
                            <Home size={20} />
                        </Link>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 customized-scrollbar relative">
                    {/* Elementos decorativos de fundo */}
                    <div className="absolute top-0 left-0 w-full h-64 bg-linear-to-b from-slate-100 to-transparent -z-10 pointer-events-none" />

                    {!loadingUser && (
                        (() => {
                            const getCategoryFromPath = (path: string) => {
                                if (path.startsWith("/admin/usuarios")) return "users";
                                if (path.startsWith("/admin/hoteis")) return "where_to_sleep";
                                if (path.startsWith("/admin/eventos")) return "events";
                                return "all";
                            };

                            const currentCategory = getCategoryFromPath(location.pathname);

                            let hasAccess = false;
                            let denyReason = "Seu cargo atual não possui permissão de leitura para acessar este módulo.";

                            if (user?.role === "admin") {
                                hasAccess = true;
                            } else if (currentCategory === "all") {
                                hasAccess = true;
                            } else if (currentCategory === "users") {
                                hasAccess = false;
                                denyReason = "As telas de gestão de Cargos e Contas são restritas ao Administrador chefe do portal.";
                            } else if (user?.permissions && user.permissions[currentCategory]) {
                                const perms = user.permissions[currentCategory];
                                if (!perms.read) {
                                    hasAccess = false;
                                } else if (location.pathname.includes("/novo") && !perms.create) {
                                    hasAccess = false;
                                    denyReason = "Permissão Negada: Você pode ler este módulo, mas não possui privilégios de CRIAÇÃO para abrir cadastros novos.";
                                } else if (location.pathname.includes("/editar") && !perms.edit) {
                                    hasAccess = false;
                                    denyReason = "Permissão Negada: Você não possui privilégios de EDIÇÃO para modificar registros.";
                                } else {
                                    hasAccess = true;
                                }
                            }

                            if (!hasAccess) {
                                return (
                                    <div className="flex flex-col items-center justify-center p-12 text-center h-full animate-in fade-in duration-500">
                                        <div className="w-24 h-24 mb-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center shadow-inner relative overflow-hidden">
                                            <div className="absolute inset-0 bg-red-500/10 mix-blend-multiply animate-pulse"></div>
                                            <AlertOctagon size={48} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Acesso Restrito</h2>
                                        <p className="text-slate-500 max-w-md text-base leading-relaxed mb-8">
                                            <b>{denyReason}</b> Se precisar de acesso, converse com o dono do portal.
                                        </p>
                                        <Link
                                            to="/admin"
                                            className="px-6 py-3 rounded-xl bg-(--color-primary) text-white font-bold hover:bg-(--color-secondary) shadow-md transition-all active:scale-95 flex items-center gap-2"
                                        >
                                            <LayoutDashboard size={18} />
                                            Voltar à Visão Geral
                                        </Link>
                                    </div>
                                );
                            }

                            return location.pathname === "/admin" ? (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <OverviewArea userPerms={user?.permissions} />
                                </div>
                            ) : (
                                <div className="animate-in fade-in zoom-in-95 duration-300 h-full">
                                    <Outlet />
                                </div>
                            );
                        })()
                    )}

                    {loadingUser && (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin w-10 h-10 border-4 border-(--color-primary) border-t-transparent rounded-full shadow-lg"></div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// Componente Interno da Visão Geral (Overview)
function OverviewArea({ userPerms }: { userPerms?: any }) {
    const [stats, setStats] = useState({ users: 0, hotels: 0, events: 0 });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Erro ao buscar estatísticas do painel:", error);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchStats();
    }, []);

    if (loadingStats) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin w-10 h-10 border-4 border-(--color-primary) border-t-transparent rounded-full shadow-lg"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">

            {/* Bloco de Boas-vindas Rápido */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 relative overflow-hidden">
                <div className="relative z-10 md:w-2/3">
                    <h3 className="text-2xl font-black text-slate-800 mb-3">Resumo do Portal</h3>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                        Acompanhe o crescimento do turismo e dos usuários locais. Utilize o menu lateral para cadastrar e gerenciar hotéis, eventos e os acessos ao sistema. As mudanças refletem instantaneamente no site público.
                    </p>
                </div>
                {/* Decoração Abstrata (Simulada com formas) */}
                <div className="absolute -right-10 -bottom-20 opacity-10 pointer-events-none hidden md:block">
                    <LayoutDashboard size={300} className="text-(--color-primary)" />
                </div>
            </div>

            {/* Grid de Estatísticas (Com visual Moderno) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {(!userPerms || userPerms.users?.read) && (
                    <Link to="/admin/usuarios" className="transition-all duration-300 hover:scale-105">
                        <StatCard
                            title="Usuários Ativos" value={stats.users} icon={Users}
                            trend="Cadastrados no sistema" trendUp={true}
                            iconBg="bg-blue-100" iconColor="text-blue-600"
                        />
                    </Link>
                )}
                {(!userPerms || userPerms.where_to_sleep?.read) && (
                    <Link to="/admin/hoteis" className="transition-all duration-300 hover:scale-105">
                        <StatCard
                            title="Total de Alojamentos" value={stats.hotels} icon={Hotel}
                            trend="Acomodações ativas" trendUp={true}
                            iconBg="bg-emerald-100" iconColor="text-emerald-600"
                        />
                    </Link>
                )}
                {(!userPerms || userPerms.events?.read) && (
                    <Link to="/admin/eventos" className="transition-all duration-300 hover:scale-105">
                        <StatCard
                            title="Eventos Ativos" value={stats.events} icon={Calendar}
                            trend="No portfólio" trendUp={null}
                            iconBg="bg-amber-100" iconColor="text-amber-600"
                        />
                    </Link>
                )}
                <Link to="#" className="transition-all duration-300 hover:scale-105 h-full">
                    <StatCard
                        title="Visitas ao Portal" value="8.4k" icon={LayoutDashboard}
                        trend="-3% que ontem" trendUp={false}
                        iconBg="bg-purple-100" iconColor="text-purple-600"
                    />
                </Link>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, trend, trendUp, iconBg, iconColor }: any) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-(--color-primary)/20 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} ${iconColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} strokeWidth={2.5} />
                </div>

                {trendUp !== null && (
                    <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    </span>
                )}
            </div>

            <div>
                <h4 className="text-3xl font-black text-slate-800 mb-1">{value}</h4>
                <p className="text-sm font-semibold text-slate-500">{title}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50">
                <p className="text-xs text-slate-400 font-medium truncate">{trend}</p>
            </div>
        </div>
    );
}