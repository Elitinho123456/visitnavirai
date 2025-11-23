import { Link } from "react-router-dom";

export default function Footer() {
  return (
    // Alterado de bg-gray-900 para usar a cor escura do seu tema: var(--color-neutral-dark)
    // Alterado de text-gray-400 para usar a cor neutra do seu tema: var(--color-neutral-gray)
    <footer className="bg-neutral-dark text-neutral-gray py-8 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm">
          <p>&copy; 2025 Visite Naviraí. Todos os direitos reservados.</p>
          <p className="mt-2">
            <span>Desenvolvido por: </span>
            <Link
              to="https://github.com/elitinho"
              target="_blank"
              rel="noopener noreferrer"
              // text-secondary/hover:text-tertiary (Assumindo que você as configurou no Tailwind)
              className="font-semibold text-secondary hover:text-tertiary transition-colors duration-300"
            >
              Wellington
            </Link>
            <span> & </span>
            <Link
              to="https://github.com/thiagoc-m"
              target="_blank"
              rel="noopener noreferrer"
              // Usando as cores funcionais text-link e hover:text-link-hover do seu :root
              className="font-semibold text-link hover:text-link-hover transition-colors duration-300"
            >
              Thiago CM
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}