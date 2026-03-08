import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";

export default function CadHotel() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // O estado inicial reflete TODA a estrutura requerida por HotelInfo.tsx
    const [formData, setFormData] = useState<any>({
        name: "", image: "", distance: "", latitude: 0, longitude: 0,
        features: [""],
        about: { title: "Sobre o Hotel", subtitle: "Conforto e Qualidade", desc: [""] },
        accommodation: { title: "Acomodações", image: "", imageCaption: "Vista do Quarto", desc: [""] },
        policies: [], // Array of {label, title, desc}
        amenities: { title: "Comodidades Principais", cards: [] }, // Array of {title, desc}
        cta: { title: "Pronto para reservar?", desc: "Entre em contato conosco." }
    });

    // Funções auxiliares para lidar com Arrays do formulário
    const handleAddPolicy = () => {
        setFormData({ ...formData, policies: [...formData.policies, { label: "14h", title: "Check-in", desc: "A partir das 14h" }] });
    };

    const handleRemovePolicy = (index: number) => {
        const newPolicies = [...formData.policies];
        newPolicies.splice(index, 1);
        setFormData({ ...formData, policies: newPolicies });
    };

    const handleAddAmenity = () => {
        setFormData({ ...formData, amenities: { ...formData.amenities, cards: [...formData.amenities.cards, { title: "Wi-Fi", desc: "Internet de alta velocidade grátis" }] } });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:${import.meta.env.VITE_API_PORT}/api/hotels`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Hotel cadastrado com sucesso! Já disponível no mapa e na página de detalhes.");
                navigate("/admin/hoteis");
            } else {
                const err = await response.json();
                alert(`Erro ao cadastrar: ${err.message}`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Cadastrar Novo Hotel ou Pousada</h2>
            <p className="text-gray-500 mb-8 pb-4 border-b border-gray-100">Preencha os dados completos para alimentar a página de detalhes dinâmicos.</p>

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* BLOCO 1: Infos Básicas e Mapa */}
                <section>
                    <h3 className="text-lg font-bold text-(--color-secondary) mb-4 border-l-4 border-(--color-primary) pl-3">1. Informações Básicas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nome do Estabelecimento</label>
                            <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">URL da Imagem Banner</label>
                            <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                                value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Distância/Localização</label>
                            <input type="text" required placeholder="Ex: 2km da praça central" className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                                value={formData.distance} onChange={(e) => setFormData({ ...formData, distance: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Latitude</label>
                                <input type="number" step="any" required className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                                    value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Longitude</label>
                                <input type="number" step="any" required className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                                    value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* BLOCO 2: Textos da Página de Detalhes (Sobre & Acomodações) */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Texto "Sobre o Hotel"</h3>
                        <textarea required rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none"
                            placeholder="Descrição que aparece no primeiro bloco..."
                            value={formData.about.desc[0]}
                            onChange={(e) => setFormData({ ...formData, about: { ...formData.about, desc: [e.target.value] } })} />
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Texto "Acomodações"</h3>
                        <textarea required rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none"
                            placeholder="Descrição dos quartos..."
                            value={formData.accommodation.desc[0]}
                            onChange={(e) => setFormData({ ...formData, accommodation: { ...formData.accommodation, desc: [e.target.value] } })} />
                    </div>
                </section>

                {/* BLOCO 3: Informações Essenciais (Políticas) */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-(--color-secondary) border-l-4 border-(--color-primary) pl-3">2. Regras e Horários (Grid)</h3>
                        <button type="button" onClick={handleAddPolicy} className="flex items-center gap-1 text-sm font-bold text-(--color-primary) bg-(--color-primary)/10 px-4 py-2 rounded-lg hover:bg-(--color-primary)/20">
                            <Plus size={16} /> Adicionar Regra
                        </button>
                    </div>

                    {formData.policies.length === 0 && <p className="text-sm text-gray-400 italic">Nenhuma regra adicionada. Adicione Check-in, Check-out, etc.</p>}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {formData.policies.map((pol: any, idx: number) => (
                            <div key={idx} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm relative">
                                <button type="button" onClick={() => handleRemovePolicy(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                <input type="text" placeholder="Ícone/Label (ex: 14h)" className="w-full mb-2 p-2 bg-gray-50 rounded border text-sm font-bold text-center" value={pol.label} onChange={(e) => { const np = [...formData.policies]; np[idx].label = e.target.value; setFormData({ ...formData, policies: np }) }} />
                                <input type="text" placeholder="Título (ex: Check-in)" className="w-full mb-2 p-2 bg-gray-50 rounded border text-sm font-bold" value={pol.title} onChange={(e) => { const np = [...formData.policies]; np[idx].title = e.target.value; setFormData({ ...formData, policies: np }) }} />
                                <input type="text" placeholder="Descrição" className="w-full p-2 bg-gray-50 rounded border text-sm" value={pol.desc} onChange={(e) => { const np = [...formData.policies]; np[idx].desc = e.target.value; setFormData({ ...formData, policies: np }) }} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* BLOCO 4: Comodidades / Cards */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-(--color-secondary) border-l-4 border-(--color-primary) pl-3">3. Comodidades (Cards)</h3>
                        <button type="button" onClick={handleAddAmenity} className="flex items-center gap-1 text-sm font-bold text-(--color-primary) bg-(--color-primary)/10 px-4 py-2 rounded-lg hover:bg-(--color-primary)/20">
                            <Plus size={16} /> Adicionar Comodidade
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.amenities.cards.map((card: any, idx: number) => (
                            <div key={idx} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex gap-4 items-center">
                                <div className="flex-1 space-y-2">
                                    <input type="text" placeholder="Título (ex: Piscina)" className="w-full p-2 bg-gray-50 rounded border font-bold" value={card.title} onChange={(e) => { const nc = [...formData.amenities.cards]; nc[idx].title = e.target.value; setFormData({ ...formData, amenities: { ...formData.amenities, cards: nc } }) }} />
                                    <input type="text" placeholder="Breve descrição" className="w-full p-2 bg-gray-50 rounded border text-sm" value={card.desc} onChange={(e) => { const nc = [...formData.amenities.cards]; nc[idx].desc = e.target.value; setFormData({ ...formData, amenities: { ...formData.amenities, cards: nc } }) }} />
                                </div>
                                <button type="button" onClick={() => { const nc = [...formData.amenities.cards]; nc.splice(idx, 1); setFormData({ ...formData, amenities: { ...formData.amenities, cards: nc } }); }} className="p-3 text-red-500 hover:bg-red-50 rounded-lg">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex justify-end pt-6 border-t border-gray-100">
                    <button type="submit" disabled={loading} className="bg-(--color-primary) hover:bg-opacity-90 text-white font-bold py-4 px-12 rounded-xl transition-all shadow-xl disabled:opacity-50 text-lg">
                        {loading ? "Registrando e Processando..." : "Publicar Hotel"}
                    </button>
                </div>
            </form>
        </div>
    );
}