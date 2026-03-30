import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Search, Crosshair } from "lucide-react";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface MapPickerProps {
    latitude: number;
    longitude: number;
    onLocationChange: (lat: number, lng: number) => void;
}

// Componente interno que captura cliques no mapa
function ClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onLocationChange(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

// Componente que centraliza o mapa quando as coordenadas mudam externamente
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng], map.getZoom());
        }
    }, [lat, lng, map]);
    return null;
}

export default function MapPicker({ latitude, longitude, onLocationChange }: MapPickerProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Coordenadas padrão: Naviraí - MS
    const defaultLat = latitude || -23.06235;
    const defaultLng = longitude || -54.20185;

    // Geocodificação com Nominatim (debounced)
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        if (value.length < 3) {
            setSuggestions([]);
            return;
        }

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5&countrycodes=br`,
                    { headers: { "Accept-Language": "pt-BR" } }
                );
                const data = await res.json();
                setSuggestions(data);
            } catch {
                setSuggestions([]);
            }
        }, 400);
    };

    const handleSelectSuggestion = (suggestion: any) => {
        const lat = parseFloat(suggestion.lat);
        const lng = parseFloat(suggestion.lon);
        onLocationChange(lat, lng);
        setSearchQuery(suggestion.display_name);
        setSuggestions([]);
    };

    const handleSearchSubmit = async () => {
        if (!searchQuery || searchQuery.length < 3) return;
        setSearching(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&countrycodes=br`,
                { headers: { "Accept-Language": "pt-BR" } }
            );
            const data = await res.json();
            if (data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lng = parseFloat(data[0].lon);
                onLocationChange(lat, lng);
                setSuggestions([]);
            } else {
                alert("Endereço não encontrado. Tente ser mais específico.");
            }
        } catch {
            alert("Erro ao buscar endereço.");
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Barra de Busca com Geocoding */}
            <div className="relative">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar endereço... (ex: Rua das Flores, Naviraí)"
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs text-sm"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSearchSubmit(); } }}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleSearchSubmit}
                        disabled={searching}
                        className="px-5 py-3.5 bg-(--color-primary) text-white rounded-2xl font-bold text-sm hover:bg-(--color-primary)/80 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                        <Crosshair size={16} />
                        {searching ? "Buscando..." : "Ir"}
                    </button>
                </div>

                {/* Sugestões autocomplete */}
                {suggestions.length > 0 && (
                    <div className="absolute z-9999 w-full mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                        {suggestions.map((s, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelectSuggestion(s)}
                                className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 text-sm text-slate-700 flex items-start gap-3 transition-colors cursor-pointer"
                            >
                                <MapPin size={16} className="text-(--color-primary) mt-0.5 shrink-0" />
                                <span className="line-clamp-2">{s.display_name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Mapa Interativo */}
            <div className="rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm" style={{ height: "350px" }}>
                <MapContainer
                    center={[defaultLat, defaultLng]}
                    zoom={15}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                    className="z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[defaultLat, defaultLng]} />
                    <ClickHandler onLocationChange={onLocationChange} />
                    <RecenterMap lat={defaultLat} lng={defaultLng} />
                </MapContainer>
            </div>

            {/* Coordenadas em texto (visualização + edição manual) */}
            <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                    <label className="block text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Latitude</label>
                    <input
                        type="number"
                        step="any"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs text-sm font-mono"
                        value={latitude}
                        onChange={(e) => onLocationChange(parseFloat(e.target.value) || 0, longitude)}
                    />
                </div>
                <div className="flex-1 space-y-1">
                    <label className="block text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Longitude</label>
                    <input
                        type="number"
                        step="any"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs text-sm font-mono"
                        value={longitude}
                        onChange={(e) => onLocationChange(latitude, parseFloat(e.target.value) || 0)}
                    />
                </div>
            </div>

            <p className="text-xs text-slate-400 text-center">
                📍 Clique no mapa para posicionar o marcador, ou busque um endereço acima.
            </p>
        </div>
    );
}
