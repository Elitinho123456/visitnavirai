import { Globe } from "lucide-react";
import type { Socials } from "@/types/interfacesTypes";

export type SocialsData = Socials;

interface SocialsInputProps {
    socials?: SocialsData;
    onChange: (socials: SocialsData) => void;
    compact?: boolean;
}

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.79 14.07c-.24.68-1.4 1.28-1.94 1.33-.5.05-1.14.07-3.69-.99-2.28-.95-3.75-3.27-3.86-3.42-.11-.15-.94-1.25-.94-2.39 0-1.13.59-1.69.8-1.92.21-.23.46-.29.62-.29.15 0 .3.01.44.01.14 0 .34-.05.53.4.19.46.66 1.6.72 1.72.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.63 1.04 1.35 1.68.93.83 1.71 1.09 1.95 1.21.24.12.38.1.52-.06.14-.16.6-1.04.76-1.4.16-.36.32-.3.54-.22.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.18 1.26z" />
        </svg>
    );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    );
}

export default function SocialsInput({ socials = {}, onChange, compact = false }: SocialsInputProps) {
    const handleFieldChange = (field: keyof SocialsData, value: string) => {
        onChange({
            ...socials,
            [field]: value
        });
    };

    if (compact) {
        return (
            <div className="space-y-3">
                <div>
                    <label className="text-xs font-bold text-[#5a4d3e] dark:text-[#f0e6d6] mb-1 flex items-center gap-1.5">
                        <span className="text-emerald-600 dark:text-emerald-400"><WhatsAppIcon className="w-3.5 h-3.5" /></span>
                        WhatsApp
                    </label>
                    <input
                        type="text"
                        placeholder="Ex: (67) 99999-9999 ou 67999999999"
                        value={socials?.whatsapp || ""}
                        onChange={(e) => handleFieldChange("whatsapp", e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] placeholder:text-[#8a7968] dark:placeholder:text-[#c5b49e]/50 rounded-xl text-sm focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-[#5a4d3e] dark:text-[#f0e6d6] mb-1 flex items-center gap-1.5">
                        <span className="text-pink-600 dark:text-pink-400"><InstagramIcon className="w-3.5 h-3.5" /></span>
                        Instagram
                    </label>
                    <input
                        type="text"
                        placeholder="Ex: @perfil ou link"
                        value={socials?.instagram || ""}
                        onChange={(e) => handleFieldChange("instagram", e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] placeholder:text-[#8a7968] dark:placeholder:text-[#c5b49e]/50 rounded-xl text-sm focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-[#5a4d3e] dark:text-[#f0e6d6] mb-1 flex items-center gap-1.5">
                        <span className="text-blue-600 dark:text-blue-400"><FacebookIcon className="w-3.5 h-3.5" /></span>
                        Facebook
                    </label>
                    <input
                        type="text"
                        placeholder="Ex: fb.com/pagina ou link"
                        value={socials?.facebook || ""}
                        onChange={(e) => handleFieldChange("facebook", e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] placeholder:text-[#8a7968] dark:placeholder:text-[#c5b49e]/50 rounded-xl text-sm focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-[#5a4d3e] dark:text-[#f0e6d6] mb-1 flex items-center gap-1.5">
                        <Globe size={14} className="text-[#8a7968] dark:text-[#c5b49e]" />
                        Website
                    </label>
                    <input
                        type="text"
                        placeholder="Ex: https://seusite.com.br"
                        value={socials?.website || ""}
                        onChange={(e) => handleFieldChange("website", e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] placeholder:text-[#8a7968] dark:placeholder:text-[#c5b49e]/50 rounded-xl text-sm focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">
                    <span className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                    </span>
                    WhatsApp
                </label>
                <input
                    type="text"
                    placeholder="Ex: (67) 99999-9999"
                    value={socials?.whatsapp || ""}
                    onChange={(e) => handleFieldChange("whatsapp", e.target.value)}
                    className="w-full px-5 py-4 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] placeholder:text-[#8a7968] dark:placeholder:text-[#c5b49e]/50 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs text-sm"
                />
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">
                    <span className="w-6 h-6 rounded-md bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                        <InstagramIcon className="w-3.5 h-3.5" />
                    </span>
                    Instagram
                </label>
                <input
                    type="text"
                    placeholder="Ex: @perfil ou https://..."
                    value={socials?.instagram || ""}
                    onChange={(e) => handleFieldChange("instagram", e.target.value)}
                    className="w-full px-5 py-4 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] placeholder:text-[#8a7968] dark:placeholder:text-[#c5b49e]/50 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs text-sm"
                />
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">
                    <span className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <FacebookIcon className="w-3.5 h-3.5" />
                    </span>
                    Facebook
                </label>
                <input
                    type="text"
                    placeholder="Ex: fb.com/pagina ou link"
                    value={socials?.facebook || ""}
                    onChange={(e) => handleFieldChange("facebook", e.target.value)}
                    className="w-full px-5 py-4 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] placeholder:text-[#8a7968] dark:placeholder:text-[#c5b49e]/50 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs text-sm"
                />
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">
                    <span className="w-6 h-6 rounded-md bg-[#ede0d8] dark:bg-[#241a06] text-[#5a4d3e] dark:text-[#f0e6d6] flex items-center justify-center">
                        <Globe size={14} />
                    </span>
                    Website
                </label>
                <input
                    type="text"
                    placeholder="Ex: https://seusite.com.br"
                    value={socials?.website || ""}
                    onChange={(e) => handleFieldChange("website", e.target.value)}
                    className="w-full px-5 py-4 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] placeholder:text-[#8a7968] dark:placeholder:text-[#c5b49e]/50 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs text-sm"
                />
            </div>
        </div>
    );
}
