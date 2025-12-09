// src/components/layout/InvestirWidget.tsx
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function InvestirWidget() {
    const { t } = useTranslation();

    return (
        <div className="bg-(--color-neutral-white) rounded-(--border-radius-lg) shadow-lg overflow-hidden group">
            <div className="relative">
                <img src="/fejunavi.png" alt={t('invest_widget.image_alt')} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-white text-2xl font-bold">
                        {t('invest_widget.title')}
                    </h3>
                </div>
            </div>
            <div className="p-5">
                <p className="text-(--color-text-body) text-sm mb-4">
                    {t('invest_widget.description')}
                </p>
                <Link to="/investir" className="inline-block w-full text-center px-4 py-2 bg-(--color-primary) text-white font-bold rounded-full hover:bg-(--color-primary-dark) transition-colors duration-300">
                    {t('invest_widget.button')}
                </Link>
            </div>
        </div>
    );
}
