import { navEvents } from '../../config/const';

export default function EventsWidget() {
    
    // Função auxiliar para formatar a data sem problemas de fuso horário
    const getEventDateInfo = (dateString: string) => {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        
        return {
            day: day,
            month: date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()
        };
    };

    return (
        <div className="flex flex-col bg-(--color-neutral-white) p-(--spacing-md) rounded-(--border-radius-lg) shadow-md border-t-4 border-(--color-secondary) max-w-2xl w-full">
            <h3 className="text-(--color-text-header) font-bold text-lg mb-4 flex items-center gap-2">
                📅 Próximos Eventos
            </h3>

            <div className="flex flex-col gap-4">
                {navEvents.slice(0, 3).map((event, index) => { // Mostra apenas os 3 primeiros para não ficar gigante
                    const dateInfo = getEventDateInfo(event.date);
                    
                    return (
                        <div key={index} className="flex gap-3 items-start border-b border-(--color-neutral-gray)/20 pb-3 last:border-0 last:pb-0 group cursor-pointer">
                            {/* Bloco da Data */}
                            <div className="flex flex-col items-center justify-center bg-(--color-neutral-light) rounded-(--border-radius-sm) p-2 min-w-14 border border-(--color-neutral-gray)/30 group-hover:border-(--color-secondary) transition-colors">
                                <span className="text-xl font-bold text-(--color-secondary)">
                                    {dateInfo.day}
                                </span>
                                <span className="text-[10px] uppercase font-bold text-(--color-neutral-dark)">
                                    {dateInfo.month}
                                </span>
                            </div>

                            {/* Informações do Evento */}
                            <div className="flex flex-col">
                                <h4 className="font-bold text-(--color-text-body) text-sm leading-tight group-hover:text-(--color-secondary) transition-colors">
                                    {event.name}
                                </h4>
                                <p className="text-xs text-(--color-neutral-gray) mt-1 line-clamp-2">
                                    {event.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Botão de "Ver Mais" opcional */}
            <button className="mt-4 w-full py-2 text-xs font-bold uppercase tracking-wider text-(--color-secondary) border border-(--color-secondary)/30 rounded-(--border-radius-sm) hover:bg-(--color-secondary) hover:text-white transition-all cursor-pointer">
                Ver Agenda Completa
            </button>
        </div>
    );
}