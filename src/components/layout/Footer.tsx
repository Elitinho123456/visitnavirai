import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    
    <footer className="bg-(--color-neutral-dark) text-(--color-neutral-gray) py-8 mt-10">

      <div className="max-w-7xl mx-auto px-(--spacing-md) sm:px-(--spacing-md) lg:px-(--spacing-lg)">
        
        <div className="text-center text-sm">

          <p>{t('footer.copyright')}</p>
          <p className="mt-2">

            <span>{t('footer.developed_by')} </span>

            {/* Elitinho */}
            <Link
              to="https://github.com/elitinho"
              target="_blank"
              rel="noopener noreferrer"
              // text-secondary/hover:text-tertiary (Assumindo que você as configurou no Tailwind)
              className="font-semibold text-secondary hover:text-tertiary transition-colors duration-300"
            >
              Elitinho
            </Link>

            <span> & </span>

            {/* Thiago Costa Martins */}
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