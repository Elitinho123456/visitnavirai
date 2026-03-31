import React, { useState, useEffect } from 'react';
import {
  Accessibility,
  X,
  Sun,
  Type,
  Link as LinkIcon,
  MousePointer,
  EyeOff,
  MoveHorizontal
} from 'lucide-react';

// Tipagem para o estado das funcionalidades
interface ActiveFeatures {
  contrast: boolean;
  largeText: boolean;
  spacing: boolean;
  highlightLinks: boolean;
  hideImages: boolean;
  cursor: boolean;
}

// Tipagem para as chaves do objeto (para usar no toggleFeature)
type FeatureKey = keyof ActiveFeatures;

const AccessibilityWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [activeFeatures, setActiveFeatures] = useState<ActiveFeatures>({
    contrast: false,
    largeText: false,
    spacing: false,
    highlightLinks: false,
    hideImages: false,
    cursor: false,
  });

  // Função para aplicar as mudanças no DOM real
  useEffect(() => {
    // document.documentElement refere-se a tag <html>
    const root = document.documentElement;

    // Helper para adicionar/remover classes de forma limpa
    const toggleClass = (condition: boolean, className: string) => {
      if (condition) root.classList.add(className);
      else root.classList.remove(className);
    };

    toggleClass(activeFeatures.contrast, 'access-contrast');
    toggleClass(activeFeatures.largeText, 'access-large-text');
    toggleClass(activeFeatures.spacing, 'access-spacing');
    toggleClass(activeFeatures.highlightLinks, 'access-links');
    toggleClass(activeFeatures.hideImages, 'access-hide-images');
    toggleClass(activeFeatures.cursor, 'access-cursor');

  }, [activeFeatures]);

  // A tipagem 'FeatureKey' garante que só passaremos strings válidas
  const toggleFeature = (feature: FeatureKey) => {
    setActiveFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  const resetAll = () => {
    setActiveFeatures({
      contrast: false,
      largeText: false,
      spacing: false,
      highlightLinks: false,
      hideImages: false,
      cursor: false,
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans hover:cursor-pointer">

      {/* Menu Aberto */}
      {isOpen && (
        <div className="mb-4 w-80 bg-(--color-neutral-light) rounded-(--border-radius-lg) shadow-2xl border border-(--color-neutral-gray) overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">

          {/* Cabeçalho do Widget */}
          <div className="bg-(--color-primary) p-4 flex justify-between items-center text-white">
            <h3 className="font-bold flex items-center gap-2">
              <Accessibility size={20} /> Acessibilidade
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded-full transition-colors cursor-pointer"
              aria-label="Fechar menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Grid de Opções */}
          <div className="p-4 grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
            <FeatureButton
              active={activeFeatures.contrast}
              onClick={() => toggleFeature('contrast')}
              icon={<Sun size={24} />}
              label="Alto Contraste"
            />
            <FeatureButton
              active={activeFeatures.highlightLinks}
              onClick={() => toggleFeature('highlightLinks')}
              icon={<LinkIcon size={24} />}
              label="Destacar Links"
            />
            <FeatureButton
              active={activeFeatures.largeText}
              onClick={() => toggleFeature('largeText')}
              icon={<Type size={24} />}
              label="Texto Maior"
            />
            <FeatureButton
              active={activeFeatures.spacing}
              onClick={() => toggleFeature('spacing')}
              icon={<MoveHorizontal size={24} />}
              label="Espaçamento"
            />
            <FeatureButton
              active={activeFeatures.hideImages}
              onClick={() => toggleFeature('hideImages')}
              icon={<EyeOff size={24} />}
              label="Ocultar Imagens"
            />
            <FeatureButton
              active={activeFeatures.cursor}
              onClick={() => toggleFeature('cursor')}
              icon={<MousePointer size={24} />}
              label="Cursor Maior"
            />

          </div>

          {/* Rodapé Reset */}
          <div className="p-3 bg-gray-100 border-t border-gray-200 text-center">
            <button
              onClick={resetAll}
              className="text-sm text-(--color-secondary) font-bold hover:underline cursor-pointer"
            >
              Resetar Configurações
            </button>
          </div>
        </div>
      )}

      {/* Botão Flutuante (Trigger) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center justify-center w-14 h-14 bg-(--color-primary) rounded-full shadow-lg hover:bg-(--color-primary-dark) hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-(--color-accent-gold) cursor-pointer"
          aria-label="Abrir menu de acessibilidade"
        >
          <Accessibility size={28} className="text-white group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
};

// --- Sub-componente Tipado ---

interface FeatureButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode; // ReactNode permite componentes (ícones), strings ou null
  label: string;
}

const FeatureButton: React.FC<FeatureButtonProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    aria-pressed={active}
    className={`
      flex flex-col items-center justify-center p-4 rounded transition-all duration-200 border-2 hover:scale-110 hover:bg-gray-300 cursor-pointer
      ${active
        ? 'bg(--color-primary) text-(--color-neutral-dark) border(--color-primary)'
        : 'bg-white text-(--color-neutral-dark) border-transparent hover:border(--color-primary) hover:bg-gray-50 shadow-sm'
      }
    `}
  >
    <div className="mb-2">{icon}</div>
    <span className="text-xs font-semibold text-center leading-tight">{label}</span>
  </button>
);

export default AccessibilityWidget;