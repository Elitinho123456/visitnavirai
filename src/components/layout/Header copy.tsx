// Header.tsx
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { navItems } from '../../config/const';
import { Sun, Moon, User, LogOut, LayoutDashboard } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

    // Detectar scroll para intensificar o glass
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Fechar menu de usuário ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchUserRole = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = token.split(".")[1];
                const decoded = JSON.parse(atob(payload));
                setUserRole(decoded.role || "user");
            } catch (e) {
                setUserRole(null);
            }
        } else {
            setUserRole(null);
        }
    };

    useEffect(() => { fetchUserRole(); }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserRole(null);
        setIsUserMenuOpen(false);
        navigate('/login');
    };

    const handleUserClick = () => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/login');
        else setIsUserMenuOpen(!isUserMenuOpen);
    };

    const [isDarkMode, setIsDarkMode] = useState(() =>
        document.documentElement.classList.contains('dark')
    );

    useEffect(() => {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        if (root.classList.contains('dark')) {
            root.classList.remove('dark');
            setIsDarkMode(false);
        } else {
            root.classList.add('dark');
            setIsDarkMode(true);
        }
    };

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const navLabels: Record<string, string> = {
        'nav.where_to_sleep': 'Onde Dormir',
        'nav.what_to_visit': 'O Que Visitar',
        'nav.where_to_eat': 'Onde Comer',
        'nav.services': 'Serviços',
        'nav.calendar': 'Calendário',
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3">
            {/* ── Floating Pill Bar ── */}
            <header
                className={`
                    w-full max-w-7xl rounded-full transition-all duration-500
                    ${isScrolled
                        ? 'shadow-[0_8px_32px_rgba(36,26,6,0.18)] bg-[rgba(255,248,243,0.92)] dark:bg-[rgba(26,18,8,0.92)]'
                        : 'shadow-[0_4px_24px_rgba(36,26,6,0.10)] bg-[rgba(255,248,243,0.80)] dark:bg-[rgba(26,18,8,0.78)]'}
                    backdrop-blur-[20px] border border-[rgba(90,77,62,0.10)]
                `}
            >
                <div className="flex items-center justify-between px-5 py-2.5">

                    {/* Logo */}
                    <Link to="/" className="group z-50 relative shrink-0">
                        <h1 className="text-(--md-on-surface) text-xl md:text-2xl font-black tracking-tight group-hover:opacity-80 transition-opacity"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            <span style={{ color: 'var(--md-primary)' }}>VISIT</span>Naviraí
                        </h1>
                    </Link>

                    {/* Hamburger (Mobile) */}
                    <button
                        className="lg:hidden z-50 p-2 rounded-full hover:bg-(--md-surface-container-low) text-(--md-primary) transition-colors"
                        onClick={toggleMenu}
                        aria-label="Abrir menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            {isMobileMenuOpen
                                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            }
                        </svg>
                    </button>

                    {/* Overlay */}
                    {isMobileMenuOpen && (
                        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleMenu} />
                    )}

                    {/* Nav */}
                    <nav className={`
                        fixed inset-y-0 right-0 z-40 w-72 shadow-2xl transform transition-transform duration-300 ease-in-out
                        bg-(--md-surface-container-lowest) dark:bg-(--md-surface-container-low)
                        lg:static lg:inset-auto lg:w-auto lg:bg-transparent lg:shadow-none lg:transform-none
                        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                    `}>
                        <ul className="flex flex-col lg:flex-row lg:items-center gap-1 p-8 lg:p-0 h-full overflow-y-auto lg:overflow-visible">

                            {/* Início */}
                            <li className="mt-10 lg:mt-0">
                                <Link
                                    to="/"
                                    className="block px-3 py-2 rounded-full text-sm font-semibold text-(--md-on-surface) hover:bg-(--md-surface-container-low) hover:text-(--md-primary) transition-all"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Início
                                </Link>
                            </li>

                            {navItems.map((item) => (
                                <li key={item.name} className="group relative flex flex-col lg:flex-row lg:items-center cursor-pointer">
                                    <div className="flex items-center px-3 py-2 rounded-full text-sm font-semibold text-(--md-on-surface) hover:bg-(--md-surface-container-low) hover:text-(--md-primary) transition-all">
                                        <Link to={String(item.path)} onClick={() => setIsMobileMenuOpen(false)}>
                                            {navLabels[item.name] || item.name}
                                        </Link>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
                                            className="w-3 h-3 ml-1 hidden lg:block transition-transform duration-300 group-hover:rotate-180 text-(--md-primary)">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </div>

                                    {/* Submenu dropdown */}
                                    <div className="relative lg:absolute lg:top-full lg:left-0 lg:pt-3 lg:opacity-0 lg:invisible lg:group-hover:opacity-100 lg:group-hover:visible transition-all duration-300 z-50 min-w-52">
                                        <ul className="pl-4 lg:pl-0 lg:bg-(--md-surface-container-lowest) lg:rounded-2xl lg:shadow-[0_8px_32px_rgba(36,26,6,0.12)] overflow-hidden border-t-4 border-t-(--md-secondary-container) lg:border-t-(--md-secondary-container)">
                                            {item.subItems.map((subItem, si) => (
                                                <li key={subItem.name} className="py-0.5 lg:py-0">
                                                    <Link
                                                        to={subItem.path}
                                                        className={`block px-4 py-2.5 text-sm font-medium text-(--md-on-surface) hover:bg-(--md-surface-container-low) hover:text-(--md-primary) transition-colors
                                                            ${si === 0 ? 'lg:pt-3' : ''}
                                                            ${si === item.subItems.length - 1 ? 'lg:pb-3' : ''}
                                                        `}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        {subItem.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            ))}

                            {/* Contato CTA */}
                            <li className="mt-4 lg:mt-0 lg:ml-2">
                                <Link
                                    to="/contato"
                                    className="inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
                                    style={{ background: 'linear-gradient(135deg, #0d6b1c, #2f8533)' }}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Contato
                                </Link>
                            </li>

                            {/* Tema + Conta */}
                            <li className="flex items-center gap-2 lg:ml-2 mt-4 lg:mt-0 border-t lg:border-t-0 pt-4 lg:pt-0">
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-full hover:bg-(--md-surface-container-low) text-(--md-on-surface) hover:text-(--md-primary) transition-colors cursor-pointer"
                                    aria-label="Alternar tema"
                                >
                                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                                </button>

                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={handleUserClick}
                                        className={`p-2 rounded-full transition-colors cursor-pointer ${
                                            userRole
                                                ? 'bg-(--md-primary)/10 text-(--md-primary)'
                                                : 'hover:bg-(--md-surface-container-low) text-(--md-on-surface) hover:text-(--md-primary)'
                                        }`}
                                        aria-label="Minha Conta"
                                    >
                                        <User size={18} />
                                    </button>

                                    {isUserMenuOpen && userRole && (
                                        <div className="absolute right-0 mt-3 w-52 bg-(--md-surface-container-lowest) rounded-2xl shadow-[0_8px_32px_rgba(36,26,6,0.14)] overflow-hidden z-50 animate-slide-down">
                                            <div className="px-4 py-3 bg-(--md-surface-container-low) border-b border-(--md-outline-variant)">
                                                <p className="text-xs font-semibold text-(--md-on-surface-variant) uppercase tracking-wider">
                                                    {userRole === 'admin' ? 'Administrador' : userRole === 'user' ? 'Usuário' : userRole}
                                                </p>
                                            </div>
                                            {userRole !== 'user' && (
                                                <button
                                                    onClick={() => { setIsUserMenuOpen(false); navigate('/admin'); }}
                                                    className="w-full text-left px-4 py-3 text-sm text-(--md-on-surface) hover:bg-(--md-surface-container-low) hover:text-(--md-primary) transition-colors flex items-center gap-2"
                                                >
                                                    <LayoutDashboard size={15} /> Acessar Painel
                                                </button>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-3 text-sm text-(--md-error) hover:bg-(--md-error-container)/40 transition-colors flex items-center gap-2"
                                            >
                                                <LogOut size={15} /> Sair
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </li>

                            {/* Google Translate */}
                            <li className="flex items-center gap-2 lg:ml-1 border-t lg:border-t-0 pt-4 lg:pt-0 mt-4 lg:mt-0">
                                <LanguageSwitcher />
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        </div>
    );
}