import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, Clock, Image as ImageIcon, Type } from "lucide-react";

export default function CadEvento() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        startTime: "",
        endTime: "",
        image: "",
        description: ""
    });

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const calendarDays = Array(firstDayOfMonth).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

    const handleDayClick = (day: number) => {
        if (!day) return;
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newDate);
        setIsDrawerOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            // Formatando a data para YYYY-MM-DD
            const dateStr = selectedDate?.toISOString().split('T')[0];

            const payload = { ...formData, date: dateStr };

            const response = await fetch(`http://localhost:${import.meta.env.VITE_API_PORT}/api/events`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Evento cadastrado com sucesso!");
                setIsDrawerOpen(false);
                setFormData({ name: "", startTime: "", endTime: "", image: "", description: "" });
            } else {
                const err = await response.json();
                alert(`Erro: ${err.message}`);
            }
        } catch (error) {
            console.error("Erro no cadastro:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 max-w-5xl mx-auto relative overflow-hidden">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <CalendarIcon className="text-(--color-primary)" /> Calendário de Eventos
                </h2>
                <div className="flex gap-2">
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 bg-gray-50 hover:bg-(--color-primary) hover:text-white rounded-full transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="font-bold text-lg min-w-[150px] text-center">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 bg-gray-50 hover:bg-(--color-primary) hover:text-white rounded-full transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <p className="text-gray-600 mb-6">Selecione um dia no calendário abaixo para agendar um novo evento no município.</p>

            {/* Grid do Calendário */}
            <div className="grid grid-cols-7 gap-2 text-center mb-2 font-bold text-gray-400 text-sm">
                <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
            </div>
            <div className="grid grid-cols-7 gap-2 md:gap-4 text-center">
                {calendarDays.map((day, idx) => (
                    <div
                        key={idx}
                        onClick={() => handleDayClick(day)}
                        className={`
                            h-16 md:h-24 flex flex-col items-center justify-center rounded-xl font-medium transition-all duration-200 border border-transparent
                            ${day ? 'bg-gray-50 cursor-pointer hover:border-(--color-primary) hover:shadow-md' : 'bg-transparent'}
                            ${selectedDate?.getDate() === day && selectedDate?.getMonth() === currentDate.getMonth() ? 'ring-2 ring-(--color-primary) bg-(--color-primary)/5' : ''}
                        `}
                    >
                        <span className="text-lg">{day}</span>
                    </div>
                ))}
            </div>

            {/* Side Drawer para Cadastro */}
            <div className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl border-l border-gray-100 transform transition-transform duration-300 z-50 flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Novo Evento</h3>
                        <p className="text-sm text-(--color-primary) font-medium">
                            {selectedDate?.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                    <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 customized-scrollbar">
                    <form id="event-form" onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Type size={16} /> Nome do Evento</label>
                            <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Clock size={16} /> Início</label>
                                <input type="time" required className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                                    value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Clock size={16} /> Fim</label>
                                <input type="time" required className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                                    value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><ImageIcon size={16} /> URL da Imagem Destaque</label>
                            <input type="url" required placeholder="https://..." className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                                value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                            {formData.image && <img src={formData.image} alt="Preview" className="mt-3 h-32 w-full object-cover rounded-lg border border-gray-200" />}
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Type size={16} /> Descrição</label>
                            <textarea required rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 resize-none"
                                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-gray-100 bg-white">
                    <button type="submit" form="event-form" disabled={loading} className="w-full bg-(--color-primary) hover:bg-opacity-90 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50">
                        {loading ? "Salvando..." : "Confirmar Evento"}
                    </button>
                </div>
            </div>

            {/* Overlay Escuro para o Drawer */}
            {isDrawerOpen && <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setIsDrawerOpen(false)} />}
        </div>
    );
}