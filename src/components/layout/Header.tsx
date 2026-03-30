// Header.tsx
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { navItems } from '../../config/const';
import { Sun, Moon, User, LogOut, LayoutDashboard, Globe } from 'lucide-react';

export default function Header() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

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

    useEffect(() => {
        fetchUserRole();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserRole(null);
        setIsUserMenuOpen(false);
        navigate('/login');
    };

    const handleUserClick = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            setIsUserMenuOpen(!isUserMenuOpen);
        }
    };

    // Tema Escuro
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return document.documentElement.classList.contains('dark');
    });

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

    // Labels para os navItems (substituindo t())
    const navLabels: Record<string, string> = {
        'nav.where_to_sleep': 'Onde Dormir',
        'nav.what_to_visit': 'O Que Visitar',
        'nav.where_to_eat': 'Onde Comer',
        'nav.services': 'Serviços',
        'nav.calendar': 'Calendário',
    };

    return (
        <header className="bg-(--color-neutral-light) shadow-sm sticky top-0 z-50 w-full">
            <div className="max-w-8xl mx-auto px-(--spacing-md) py-(--spacing-md) flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="group z-50 relative">
                    <h1 className="text-black text-2xl md:text-3xl font-bold tracking-tight group-hover:opacity-80 transition-opacity">
                        <b className='text-(--color-primary)'>VISIT</b>Naviraí
                    </h1>
                </Link>

                {/* Botão Hambúrguer (Mobile) */}
                <button
                    className="lg:hidden z-50 text-(--color-primary) focus:outline-none"
                    onClick={toggleMenu}
                    aria-label="Abrir menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        )}
                    </svg>
                </button>

                {/* Overlay Escuro */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleMenu}></div>
                )}

                <nav className={`
                    fixed inset-y-0 right-0 z-40 w-64 bg-(--color-neutral-light) shadow-xl transform transition-transform duration-300 ease-in-out
                    lg:static lg:inset-auto lg:w-auto lg:bg-transparent lg:shadow-none lg:transform-none
                    ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                `}>
                    <ul className="flex flex-col lg:flex-row lg:items-center gap-6 p-8 lg:p-0 h-full overflow-y-auto lg:overflow-visible">

                        <li className='mt-10 lg:mt-0'>
                            <Link to="/" className="text-(--color-text-body) font-medium hover:text-(--color-link-hover) transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                Início
                            </Link>
                        </li>

                        {navItems.map((item) => (
                            <li key={item.name} className="group relative flex flex-col lg:flex-row lg:items-center cursor-pointer">
                                <div className="flex items-center justify-between text-(--color-text-body) font-medium lg:group-hover:text-(--color-link-hover) transition-colors py-2">
                                    <Link to={String(item.path)}>
                                        <span className="relative inline-block transition-transform duration-300 lg:group-hover:scale-110 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-(--color-primary) after:transition-all after:duration-300 after:w-0 lg:group-hover:after:w-full">
                                            {navLabels[item.name] || item.name}
                                        </span>
                                    </Link>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 ml-1 hidden lg:block transition-transform duration-300 group-hover:rotate-180 text-(--color-primary)">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </div>

                                {/* Submenu */}
                                <div className="relative lg:absolute lg:top-full lg:left-0 lg:pt-4 lg:opacity-0 lg:invisible lg:group-hover:opacity-100 lg:group-hover:visible transition-all duration-300 z-50 min-w-55">
                                    <ul className="pl-4 lg:pl-0  border-(--color-accent-gold)  lg:bg-(--color-neutral-white) lg:rounded-(--border-radius-lg) lg:shadow-xl  lg:border-(--color-neutral-gray)/20 lg:border-t-4 lg:border-t-(--color-accent-gold)">
                                        {item.subItems.map((subItem) => (

                                            <li key={subItem.name} className="py-1 lg:py-0">

                                                {subItem === item.subItems[0] ? (
                                                    <Link to={subItem.path} className="block lg:px-(--spacing-md) lg:py-(--spacing-sm) text-sm text-(--color-neutral-gray) lg:text-(--color-text-body) hover:text-(--color-primary) lg:hover:bg-(--color-primary) lg:hover:text-(--color-neutral-white) lg:hover:rounded-tr-xl lg:hover:rounded-tl-xl  transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                                                        {subItem.label}
                                                    </Link>
                                                ) : (
                                                    <>
                                                        {subItem === item.subItems[item.subItems.length - 1] ? (
                                                            <Link to={subItem.path} className="block lg:px-(--spacing-md) lg:py-(--spacing-sm) text-sm text-(--color-neutral-gray) lg:text-(--color-text-body) hover:text-(--color-primary) lg:hover:bg-(--color-primary) lg:hover:text-(--color-neutral-white) lg:hover:rounded-br-xl lg:hover:rounded-bl-xl  transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                                                                {subItem.label}
                                                            </Link>
                                                        ) : (
                                                            <Link to={subItem.path} className="block lg:px-(--spacing-md) lg:py-(--spacing-sm) text-sm text-(--color-neutral-gray) lg:text-(--color-text-body) hover:text-(--color-primary) lg:hover:bg-(--color-primary) lg:hover:text-(--color-neutral-white)  transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                                                                {subItem.label}
                                                            </Link>
                                                        )
                                                        }
                                                    </>
                                                )
                                                }
                                            </li>

                                        ))}
                                    </ul>
                                </div>
                            </li>
                        ))}

                        <li className="mt-4 lg:mt-0">
                            <Link to="/contato" className="inline-block w-full text-center lg:w-auto px-5 py-2 bg-(--color-primary) text-white font-bold rounded-full shadow-md hover:bg-(--color-primary-dark)/90 -all transition-transform duration-300 hover:scale-110" onClick={() => setIsMobileMenuOpen(false)}>
                                Contato
                            </Link>
                        </li>

                        {/* --- Botão Tema Escuro/Claro e Conta --- */}
                        <li className="flex items-center gap-2 lg:ml-4 border-t lg:border-t-0 pt-4 lg:pt-0 mt-4 lg:mt-0">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full bg-(--color-background) border border-(--color-neutral-gray)/30 text-(--color-text-body) hover:bg-(--color-primary) hover:text-white transition-colors"
                                aria-label="Alternar tema"
                            >
                                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={handleUserClick}
                                    className={`p-2 rounded-full border border-(--color-neutral-gray)/30 text-(--color-text-body) hover:bg-(--color-primary) hover:text-white transition-colors ${userRole ? "bg-(--color-primary)/10 text-(--color-primary) border-(--color-primary)/50" : "bg-(--color-background)"
                                        }`}
                                    aria-label="Minha Conta"
                                >
                                    <User size={20} />
                                </button>

                                {/* Dropdown Menu de Usuário */}
                                {isUserMenuOpen && userRole && (
                                    <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-(--color-neutral-light) rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                                            <p className="text-sm font-medium text-gray-500 text-center">
                                                {userRole === 'admin' ? 'Administrador' : 'Usuário Logado'}
                                            </p>
                                        </div>

                                        {userRole === 'admin' && (
                                            <button
                                                onClick={() => { setIsUserMenuOpen(false); navigate('/admin'); }}
                                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-(--color-primary)/10 hover:text-(--color-primary) transition-colors flex items-center gap-2"
                                            >
                                                <LayoutDashboard size={16} />
                                                Acessar Painel
                                            </button>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                                        >
                                            <LogOut size={16} />
                                            Sair
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>

                        {/* --- Google Translate Widget --- */}
                        <li className="flex items-center gap-2 lg:ml-2 border-t lg:border-t-0 pt-4 lg:pt-0 mt-4 lg:mt-0">
                            <div className="flex items-center gap-2 bg-(--color-background) border border-(--color-neutral-gray)/30 rounded-full px-3 py-1.5 min-h-[38px] overflow-hidden">
                                <Globe size={16} className="text-(--color-primary) shrink-0" />
                                <div id="google_translate_element" className="notranslate"></div>
                            </div>
                        </li>

                    </ul>
                </nav>
            </div>
        </header>
    );
}