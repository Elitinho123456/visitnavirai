// Formata o nome para uso em pastas (lowercase, sem espaços, sem acentos)
export function sanitizeName(name: string): string {
    return name
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos
        .replace(/\s+/g, "_") // espaços → underscores
        .replace(/[^a-z0-9_-]/g, ""); // remove caracteres especiais
}

// Mapeia categoria para nome de pasta
export function categoryFolder(category: string): string {
    const map: Record<string, string> = {
        "Hotel": "hoteis",
        "Pousada": "pousadas",
        "Flat": "flats",
        "Área de Camping": "campings",
        "Eventos": "eventos",
    };
    return map[category] || "diversos";
}
