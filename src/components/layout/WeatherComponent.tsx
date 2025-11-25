import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Tipagem simples para os dados da API
interface WeatherData {
    current: {
        temperature_2m: number;
        relative_humidity_2m: number;
        weather_code: number;
    };
    daily: {
        temperature_2m_max: number[];
        temperature_2m_min: number[];
    };
}

// Função simples para traduzir o código do tempo da Open-Meteo
const getWeatherDescription = (code: number, t: (key: string) => string) => {
    if (code === 0) return t('weather.description.clear_sky');
    if (code >= 1 && code <= 3) return t('weather.description.partly_cloudy');
    if (code >= 45 && code <= 48) return t('weather.description.fog');
    if (code >= 51 && code <= 67) return t('weather.description.light_rain');
    if (code >= 80 && code <= 99) return t('weather.description.heavy_rain');
    return t('weather.description.variable');
};

export default function WeatherWidget() {
    const { t } = useTranslation();
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Coordenadas de Naviraí: -23.0645, -54.1959
        fetch('https://api.open-meteo.com/v1/forecast?latitude=-23.0645&longitude=-54.1959&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FSao_Paulo')
            .then(response => response.json())
            .then(data => {
                setWeather(data);
                setLoading(false);
            })
            .catch(err => console.error("Erro ao carregar clima:", err));
    }, []);

    if (loading) return <div className="text-(--color-neutral-gray)">{t('weather.loading')}</div>;

    if (!weather) return null;

    return (
        <div className="
            flex flex-col items-center justify-center 
            bg-(--color-neutral-white) 
            p-(--spacing-md) 
            rounded-(--border-radius-lg) 
            shadow-md 
            border-l-4 border-(--color-primary)
            max-w-xs w-full
        ">
            <h3 className="text-(--color-text-header) font-bold text-lg mb-2">
                {t('weather.title')}
            </h3>
            
            <div className="text-4xl font-bold text-(--color-neutral-dark) mb-1">
                {Math.round(weather.current.temperature_2m)}°C
            </div>
            
            <div className="text-(--color-text-body) font-medium mb-3">
                {getWeatherDescription(weather.current.weather_code, t)}
            </div>

            <div className="w-full flex justify-between text-sm text-(--color-neutral-gray) px-(--spacing-lg)">
                <div className="flex flex-col items-center">
                    <span>{t('weather.min')}</span>
                    <span className="font-bold text-(--color-secondary)">
                        {Math.round(weather.daily.temperature_2m_min[0])}°
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <span>{t('weather.humidity')}</span>
                    <span className="font-bold text-(--color-primary)">
                        {weather.current.relative_humidity_2m}%
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <span>{t('weather.max')}</span>
                    <span className="font-bold text-(--color-accent-gold)">
                        {Math.round(weather.daily.temperature_2m_max[0])}°
                    </span>
                </div>
            </div>
        </div>
    );
}