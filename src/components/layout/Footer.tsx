import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-(--color-neutral-dark) text-(--color-neutral-gray) py-8">
      <div className="max-w-7xl mx-auto px-(--spacing-md) sm:px-(--spacing-md) lg:px-(--spacing-lg)">
        <div className="text-center text-sm">
          <p>© 2025 VISITNaviraí. Todos os direitos reservados.</p>
          <p className="mt-2">
            <span>Desenvolvido por: </span>
            <Link
              to="https://github.com/elitinho"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-secondary hover:text-tertiary transition-colors duration-300"
            >
              Elitinho
            </Link>
            <span> & </span>
            <Link
              to="https://github.com/thiagoc-m"
              target="_blank"
              rel="noopener noreferrer"
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