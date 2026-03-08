import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import { LayoutDashboard, Users, Hotel, Calendar, LogOut, Menu, X, TrendingUp, TrendingDown, Bell } from "lucide-react";
import { useState, useEffect } from "react";

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);
    const [greeting, setGreeting] = useState("Bem-vindo");

    useEffect(() => {
        // Lógica de Saudação Dinâmica
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Bom dia");
        else if (hour < 18) setGreeting("Boa tarde");
        else setGreeting("Boa noite");

        // Decodificando Token
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = token.split(".")[1];
                const decoded = JSON.parse(atob(payload));
                setUser({ name: decoded.name || "Admin", email: decoded.email || "admin@navirai.ms.gov.br" });
            } catch (e) {
                console.error("Erro ao ler token:", e);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const navItems = [
        { path: "/admin", icon: LayoutDashboard, label: "Visão Geral" },
        { path: "/admin/usuarios", icon: Users, label: "Usuários" },
        { path: "/admin/hoteis/novo", icon: Hotel, label: "Hotéis e Pousadas" },
        { path: "/admin/eventos/novo", icon: Calendar, label: "Eventos Locais" },
    ];

    // Fecha a sidebar no mobile ao clicar em um link
    const closeSidebarMobile = () => {
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans selection:bg-(--color-primary) selection:text-white">

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
                    fixed md:relative z-50 h-full w-[280px] bg-white border-r border-slate-200 shadow-2xl md:shadow-none
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
                    <div className="flex items-center gap-3 mb-4 p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-linear-to-tr from-(--color-secondary) to-(--color-primary) text-white flex items-center justify-center font-bold text-lg shadow-inner">
                            {user?.name?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div className="overflow-hidden flex-1">
                            <p className="text-sm font-bold text-slate-900 truncate">{user?.name || "Administrador"}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-bold text-sm border border-transparent hover:border-red-100"
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
                        <button className="relative p-2.5 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-(--color-primary) hover:border-(--color-primary)/30 transition-all shadow-sm">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 customized-scrollbar relative">
                    {/* Elementos decorativos de fundo */}
                    <div className="absolute top-0 left-0 w-full h-64 bg-linear-to-b from-slate-100 to-transparent -z-10 pointer-events-none" />

                    {location.pathname === "/admin" ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <OverviewArea />
                        </div>
                    ) : (
                        <div className="animate-in fade-in zoom-in-95 duration-300 h-full">
                            <Outlet />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// Componente Interno da Visão Geral (Overview)
function OverviewArea() {
    const [stats, setStats] = useState({ users: 0, hotels: 0, events: 0 });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await fetch(`http://localhost:${import.meta.env.VITE_API_PORT}/api/dashboard/stats`, {
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
                    <div className="mt-6 flex gap-3">
                        <Link to="/admin/eventos/novo" className="px-5 py-2.5 bg-(--color-primary) text-white font-bold rounded-xl shadow-md shadow-(--color-primary)/20 hover:bg-opacity-90 transition-all text-sm">
                            + Novo Evento
                        </Link>
                        <Link to="/admin/hoteis/novo" className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm border border-slate-200">
                            Cadastrar Hotel
                        </Link>
                    </div>
                </div>
                {/* Ilustração ou Decoração Abstrata (Simulada com formas) */}
                <div className="absolute -right-10 -bottom-20 opacity-10 pointer-events-none hidden md:block">
                    <LayoutDashboard size={300} className="text-(--color-primary)" />
                </div>
            </div>

            {/* Grid de Estatísticas (Com visual Moderno) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard
                    title="Usuários Ativos" value={stats.users} icon={Users}
                    trend="Cadastrados no sistema" trendUp={true}
                    iconBg="bg-blue-100" iconColor="text-blue-600"
                />
                <StatCard
                    title="Total de Hotéis" value={stats.hotels} icon={Hotel}
                    trend="Acomodações ativas" trendUp={true}
                    iconBg="bg-emerald-100" iconColor="text-emerald-600"
                />
                <StatCard
                    title="Eventos Ativos" value={stats.events} icon={Calendar}
                    trend="No portfólio" trendUp={null}
                    iconBg="bg-amber-100" iconColor="text-amber-600"
                />
                <StatCard
                    title="Visitas ao Portal" value="8.4k" icon={LayoutDashboard}
                    trend="-3% que ontem" trendUp={false}
                    iconBg="bg-purple-100" iconColor="text-purple-600"
                />
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