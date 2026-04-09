// LanguageSwitcher.tsx
// Seletor de idioma customizado que aciona o Google Translate programaticamente.
// Suporta: Português (pt), Inglês (en) e Espanhol (es).

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'pt', label: 'Português', flag: '🇧🇷', short: 'PT' },
  { code: 'en', label: 'English',   flag: '🇺🇸', short: 'EN' },
  { code: 'es', label: 'Español',   flag: '🇪🇸', short: 'ES' },
] as const;

type LangCode = typeof LANGUAGES[number]['code'];

/**
 * Aciona a tradução via cookie do Google Translate.
 * O Google Translate usa o cookie "googtrans" para saber o idioma alvo.
 * Formato: /pagemLanguage/targetLanguage   ex: /pt/en
 */
function setGoogleTranslateCookie(langCode: LangCode) {
  // Remove cookie antes de setar para forçar re-leitura
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;

  if (langCode === 'pt') {
    // Para português (idioma original), apenas apagamos o cookie e recarregamos
    window.location.reload();
    return;
  }

  const cookieValue = `/pt/${langCode}`;
  document.cookie = `googtrans=${cookieValue}; path=/`;
  document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
  window.location.reload();
}

/** Lê o idioma atual a partir do cookie "googtrans" */
function getCurrentLangFromCookie(): LangCode {
  const match = document.cookie.match(/googtrans=\/pt\/([a-z]{2})/);
  if (match && match[1]) {
    const found = LANGUAGES.find(l => l.code === match[1]);
    if (found) return found.code;
  }
  return 'pt';
}

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState<LangCode>('pt');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detecta o idioma atual no mount
  useEffect(() => {
    setCurrent(getCurrentLangFromCookie());
  }, []);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = LANGUAGES.find(l => l.code === current) ?? LANGUAGES[0];

  const handleSelect = (langCode: LangCode) => {
    if (langCode === current) {
      setIsOpen(false);
      return;
    }
    setCurrent(langCode);
    setIsOpen(false);
    setGoogleTranslateCookie(langCode);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão trigger */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-1.5 bg-(--color-background) border border-(--color-neutral-gray)/30 rounded-full px-3 py-1.5 text-sm font-medium text-(--color-text-body) hover:bg-(--color-primary) hover:text-white hover:border-(--color-primary) transition-all duration-200 cursor-pointer group"
        aria-label="Selecionar idioma"
        aria-expanded={isOpen}
      >
        <Globe size={15} className="text-(--color-primary) group-hover:text-white transition-colors shrink-0" />
        <span className="text-xs font-bold">{currentLang.flag} {currentLang.short}</span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-(--color-neutral-light) rounded-xl shadow-xl border border-(--color-neutral-gray)/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 border-b border-(--color-neutral-gray)/10">
            <p className="text-xs text-(--color-neutral-gray) font-medium uppercase tracking-wider">Idioma</p>
          </div>

          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors cursor-pointer
                ${lang.code === current
                  ? 'bg-(--color-primary)/10 text-(--color-primary) font-semibold'
                  : 'text-(--color-text-body) hover:bg-(--color-primary)/5 hover:text-(--color-primary)'
                }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
              </span>
              {lang.code === current && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
