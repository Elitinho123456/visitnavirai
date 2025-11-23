import { useState } from 'react';
import { Link } from 'react-router-dom';
import { navItems } from '../../config/const';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <header className="bg-(--color-neutral-light) shadow-sm sticky top-0 z-50 w-full">
            <div className="max-w-7xl mx-auto px-(--spacing-md) py-(--spacing-md) flex items-center justify-between">
                
                {/* Logo */}
                <Link to="/" className="group z-50 relative">
                    <h1 className="text-(--color-primary) text-2xl md:text-3xl font-bold tracking-tight group-hover:opacity-80 transition-opacity">
                        <b className='text-(--color-accent-gold)'>VISIT</b>Naviraí
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

                {/* Overlay Escuro (Fundo quando menu abre) */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleMenu}></div>
                )}

                {/* Navegação Desktop e Mobile */}
                <nav className={`
                    fixed inset-y-0 right-0 z-40 w-64 bg-(--color-neutral-light) shadow-xl transform transition-transform duration-300 ease-in-out
                    lg:static lg:inset-auto lg:w-auto lg:bg-transparent lg:shadow-none lg:transform-none
                    ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                `}>
                    <ul className="flex flex-col lg:flex-row lg:items-center gap-6 p-8 lg:p-0 h-full overflow-y-auto lg:overflow-visible">
                        
                        <li className='mt-10 lg:mt-0'>
                            <Link to="/" className="text-(--color-text-body) font-medium hover:text-(--color-link-hover) transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                Home
                            </Link>
                        </li>

                        {navItems.map((item) => (
                            <li key={item.name} className="group relative flex flex-col lg:flex-row lg:items-center cursor-pointer">
                                {/* Título do Item */}
                                <div className="flex items-center justify-between text-(--color-text-body) font-medium lg:group-hover:text-(--color-link-hover) transition-colors py-2">
                                    <span>{item.name}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 ml-1 hidden lg:block transition-transform duration-300 group-hover:rotate-180 text-(--color-accent-gold)">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </div>

                                {/* Submenu */}
                                <div className="relative lg:absolute lg:top-full lg:left-0 lg:pt-4 lg:opacity-0 lg:invisible lg:group-hover:opacity-100 lg:group-hover:visible transition-all duration-300 z-50 min-w-[220px]">
                                    <ul className="
                                        pl-4 lg:pl-0 border-l-2 border-(--color-accent-gold) lg:border-l-0
                                        lg:bg-(--color-neutral-white) lg:rounded-(--border-radius-lg) lg:shadow-xl 
                                        lg:border lg:border-(--color-neutral-gray)/20 lg:border-t-4 lg:border-t-(--color-accent-gold)
                                    ">
                                        {item.subItems.map((subItem) => (
                                            <li key={subItem.name} className="py-1 lg:py-0">
                                                <Link to={subItem.path} className="block lg:px-(--spacing-md) lg:py-(--spacing-sm) text-sm text-(--color-neutral-gray) lg:text-(--color-text-body) hover:text-(--color-primary) lg:hover:bg-(--color-primary) lg:hover:text-(--color-neutral-white) lg:hover:rounded-xl transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                                                    {subItem.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                        ))}

                        <li className="mt-4 lg:mt-0">
                            <Link to="/contato" className="inline-block w-full text-center lg:w-auto px-5 py-2 bg-(--color-button-background) text-(--color-button-text) font-bold rounded-full shadow-md hover:bg-(--color-accent-gold)/90 transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                                Contato
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}