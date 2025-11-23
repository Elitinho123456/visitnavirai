import { Link } from 'react-router-dom';
import { navItems } from '../../config/const';

export default function Header() {
    return (
        <header className="bg-(--color-neutral-light) py-(--spacing-md) px-(--spacing-lg) flex items-center justify-between shadow-sm sticky top-0 z-50">
            {/* Logo */}
            <Link to="/" className="group">
                <h1 className="text-(--color-primary) text-3xl font-bold tracking-tight group-hover:opacity-80 transition-opacity">
                    <b className='text-(--color-accent-gold)'>VISIT</b>Naviraí
                </h1>
            </Link>

            {/* Navegação */}
            <nav>
                <ul className="flex items-center space-x-6">
                    {/* Link Home Simples */}
                    <li>
                        <Link
                            to="/"
                            className="text-(--color-text-body) font-medium hover:text-(--color-link-hover) transition-colors"
                        >
                            Home
                        </Link>
                    </li>

                    {/* Itens com Submenu */}
                    {navItems.map((item) => (
                        <li key={item.name} className="group relative flex items-center h-full py-2 cursor-pointer">
                            {/* Botão Principal do Menu */}
                            <Link
                                to="#"
                                className="flex items-center gap-1 text-(--color-text-body) font-medium group-hover:text-(--color-link-hover) transition-colors"
                            >
                                {item.name}
                                {/* Ícone de Seta (Chevron) */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2.5}
                                    stroke="currentColor"
                                    className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180 text-(--color-accent-gold)"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </Link>

                            {/* Submenu Dropdown */}
                            <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform group-hover:translate-y-0 translate-y-2 z-50 min-w-[220px]">
                                <ul className="
                                    bg-(--color-neutral-white) 
                                    rounded-(--border-radius-lg) 
                                    shadow-xl 
                                    border border-(--color-neutral-gray)/20 
                                    border-t-4 border-t-(--color-accent-gold) 
                                    overflow-hidden
                                ">
                                    {item.subItems.map((subItem) => (
                                        <li key={subItem.name}>
                                            <Link
                                                to={subItem.path}
                                                className="
                                                    block 
                                                    px-(--spacing-md) py-(--spacing-sm)
                                                    text-(--color-text-body) 
                                                    text-sm
                                                    transition-all duration-200
                                                    hover:bg-(--color-primary) 
                                                    hover:text-(--color-neutral-white)
                                                    hover:pl-6
                                                "
                                            >
                                                {subItem.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}

                    {/* Botão Contato Destacado */}
                    <li>
                        <Link
                            to="/contato"
                            className="
                                px-5 py-2 
                                bg-(--color-button-background) 
                                text-(--color-button-text) 
                                font-bold 
                                rounded-full 
                                shadow-md 
                                hover:shadow-lg 
                                hover:bg-(--color-accent-gold)/90 
                                hover:-translate-y-0.5
                                transition-all duration-200
                            "
                        >
                            Contato
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}