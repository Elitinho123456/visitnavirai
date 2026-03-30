import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, CloudFog, CloudLightning, Droplets, Thermometer } from 'lucide-react';

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

const getWeatherIcon = (code: number, className: string) => {
    if (code === 0) return <Sun className={`text-yellow-500 ${className}`} />;
    if (code >= 1 && code <= 3) return <Cloud className={`text-gray-400 ${className}`} />;
    if (code >= 45 && code <= 48) return <CloudFog className={`text-gray-500 ${className}`} />;
    if (code >= 51 && code <= 67) return <CloudRain className={`text-blue-400 ${className}`} />;
    if (code >= 80 && code <= 99) return <CloudLightning className={`text-purple-500 ${className}`} />;
    return <Cloud className={`text-gray-400 ${className}`} />;
};

const getWeatherDescription = (code: number) => {
    if (code === 0) return 'Céu Limpo ☀️';
    if (code >= 1 && code <= 3) return 'Parcialmente Nublado ⛅';
    if (code >= 45 && code <= 48) return 'Nevoeiro 🌫️';
    if (code >= 51 && code <= 67) return 'Chuva Leve 🌦️';
    if (code >= 80 && code <= 99) return 'Chuva Forte/Tempestade ⛈️';
    return 'Clima Variável';
};

export default function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://api.open-meteo.com/v1/forecast?latitude=-23.0645&longitude=-54.1959&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FSao_Paulo')
            .then(response => response.json())
            .then(data => {
                setWeather(data);
                setLoading(false);
            })
            .catch(err => console.error("Erro ao carregar clima:", err));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center p-8 bg-white/50 dark:bg-black/10 backdrop-blur-md rounded-2xl animate-pulse">
            <div className="text-(--color-neutral-gray)">Carregando clima...</div>
        </div>
    );

    if (!weather) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="relative flex flex-col items-center justify-center bg-white/40 dark:bg-(--color-neutral-light)/40 backdrop-blur-xl p-6 md:p-8 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/40 dark:border-white/10 w-full overflow-hidden group"
        >
            <div className="absolute top-0 right-0 -m-4 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl group-hover:bg-blue-400/30 transition-colors" />
            <div className="absolute bottom-0 left-0 -m-4 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl group-hover:bg-yellow-400/30 transition-colors" />

            <div className="relative z-10 w-full">
                <div className="flex justify-between items-start w-full mb-6">
                    <h3 className="text-gray-800 font-black text-xl tracking-tight uppercase">
                        Tempo em Naviraí
                    </h3>
                    <motion.div
                        initial={{ rotate: -20 }}
                        animate={{ rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    >
                        {getWeatherIcon(weather.current.weather_code, "w-10 h-10 drop-shadow-lg")}
                    </motion.div>
                </div>

                <div className="flex items-end gap-2 mb-2">
                    <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-linear-to-br from-(--color-primary) to-blue-500 drop-shadow-sm leading-none">
                        {Math.round(weather.current.temperature_2m)}°
                    </div>
                </div>

                <div className="text-(--color-text-header) font-bold text-lg mb-8 opacity-90">
                    {getWeatherDescription(weather.current.weather_code)}
                </div>

                <div className="grid grid-cols-3 gap-2 w-full pt-4 border-t border-(--color-neutral-gray)/20">
                    <div className="flex flex-col items-center gap-1 group/item">
                        <Thermometer size={16} className="text-(--color-secondary) opacity-70 group-hover/item:opacity-100 transition-opacity" />
                        <span className="text-xs text-(--color-neutral-gray) font-medium uppercase">Mín</span>
                        <span className="font-bold text-(--color-text-header)">{Math.round(weather.daily.temperature_2m_min[0])}°</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 border-l border-r border-(--color-neutral-gray)/20 group/item">
                        <Droplets size={16} className="text-blue-400 opacity-70 group-hover/item:opacity-100 transition-opacity" />
                        <span className="text-xs text-(--color-neutral-gray) font-medium uppercase">Umidade</span>
                        <span className="font-bold text-(--color-text-header)">{weather.current.relative_humidity_2m}%</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 group/item">
                        <Sun size={16} className="text-yellow-500 opacity-70 group-hover/item:opacity-100 transition-opacity" />
                        <span className="text-xs text-(--color-neutral-gray) font-medium uppercase">Máx</span>
                        <span className="font-bold text-(--color-text-header)">{Math.round(weather.daily.temperature_2m_max[0])}°</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}