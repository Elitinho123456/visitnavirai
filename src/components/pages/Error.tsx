import { Link } from 'react-router-dom';

export default function Error() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-(--color-neutral-light) px-4 text-center">
            <div className="bg-(--color-neutral-white) p-8 md:p-12 rounded-(--border-radius-lg) shadow-lg border-t-8 border-(--color-secondary) max-w-lg w-full">
                
                <h1 className="text-8xl font-extrabold text-(--color-secondary) mb-4 animate-pulse">
                    404
                </h1>
                
                <h2 className="text-2xl md:text-3xl font-bold text-(--color-text-header) mb-4">
                    Oops! Algo deu errado.
                </h2>
                
                <p className="text-(--color-text-body) text-lg mb-8">
                    A página que você está procurando não existe ou foi movida.
                    Que tal voltar para um lugar seguro?
                </p>

                <Link 
                    to="/" 
                    className="
                        inline-block
                        px-8 py-3 
                        bg-(--color-primary) 
                        text-(--color-neutral-white) 
                        font-bold 
                        rounded-full 
                        shadow-md 
                        hover:bg-(--color-primary)/90 
                        hover:shadow-lg 
                        transition-all duration-300
                        transform hover:-translate-y-1
                    "
                >
                    Voltar para Home
                </Link>
            </div>

            <div className="mt-8 text-(--color-neutral-gray) text-sm">
                Código de erro: PAGE_NOT_FOUND
            </div>
        </div>
    );
}