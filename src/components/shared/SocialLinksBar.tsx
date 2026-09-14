import { Globe } from "lucide-react";
import type { Socials } from "@/types/interfacesTypes";

interface SocialLinksBarProps {
    socials?: Socials;
    className?: string;
    variant?: "cta" | "badges";
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

function formatWhatsAppLink(phone: string): string {
    if (phone.startsWith("http")) return phone;
    const digits = phone.replace(/\D/g, "");
    if (!digits) return "";
    const full = digits.length <= 11 ? `55${digits}` : digits;
    return `https://wa.me/${full}`;
}

function formatInstagramLink(user: string): string {
    if (user.startsWith("http")) return user;
    const clean = user.replace(/^@/, "").trim();
    return clean ? `https://instagram.com/${clean}` : "";
}

function formatFacebookLink(page: string): string {
    if (page.startsWith("http")) return page;
    const clean = page.replace(/^@/, "").trim();
    return clean ? `https://facebook.com/${clean}` : "";
}

function formatWebsiteLink(site: string): string {
    if (!site.trim()) return "";
    if (site.startsWith("http")) return site;
    return `https://${site.trim()}`;
}

export default function SocialLinksBar({ socials, className = "", variant = "cta" }: SocialLinksBarProps) {
    if (!socials) return null;

    const waLink = socials.whatsapp ? formatWhatsAppLink(socials.whatsapp) : "";
    const igLink = socials.instagram ? formatInstagramLink(socials.instagram) : "";
    const fbLink = socials.facebook ? formatFacebookLink(socials.facebook) : "";
    const webLink = socials.website ? formatWebsiteLink(socials.website) : "";

    const hasAny = waLink || igLink || fbLink || webLink;
    if (!hasAny) return null;

    if (variant === "cta") {
        return (
            <div className={`flex flex-wrap items-center justify-center gap-3 pt-6 ${className}`}>
                {waLink && (
                    <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 hover:bg-emerald-50 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
                    >
                        <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                        WhatsApp
                    </a>
                )}

                {igLink && (
                    <a
                        href={igLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-pink-700 hover:bg-pink-50 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
                    >
                        <InstagramIcon className="w-4 h-4 text-pink-600" />
                        Instagram
                    </a>
                )}

                {fbLink && (
                    <a
                        href={fbLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
                    >
                        <FacebookIcon className="w-4 h-4 text-blue-600" />
                        Facebook
                    </a>
                )}

                {webLink && (
                    <a
                        href={webLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#241a06] hover:bg-[#ede0d8] rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
                    >
                        <Globe size={16} className="text-[#5a4d3e]" />
                        Website
                    </a>
                )}
            </div>
        );
    }

    return (
        <div className={`flex flex-wrap items-center gap-2 ${className}`}>
            {waLink && (
                <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Conversar no WhatsApp"
                    className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
                >
                    <WhatsAppIcon className="w-4 h-4" />
                </a>
            )}

            {igLink && (
                <a
                    href={igLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ver no Instagram"
                    className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
                >
                    <InstagramIcon className="w-4 h-4" />
                </a>
            )}

            {fbLink && (
                <a
                    href={fbLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ver no Facebook"
                    className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
                >
                    <FacebookIcon className="w-4 h-4" />
                </a>
            )}

            {webLink && (
                <a
                    href={webLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Acessar Website"
                    className="w-10 h-10 rounded-full bg-[#ede0d8] text-[#5a4d3e] hover:bg-[#241a06] hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
                >
                    <Globe size={16} />
                </a>
            )}
        </div>
    );
}
