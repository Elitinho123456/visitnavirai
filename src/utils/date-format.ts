export interface DateParts {
    year: number;
    month: number;
    day: number;
}

function pad(value: number) {
    return String(value).padStart(2, '0');
}

export function parseDateParts(value: string | Date | null | undefined): DateParts | null {
    if (!value) return null;

    if (value instanceof Date) {
        return {
            year: value.getFullYear(),
            month: value.getMonth() + 1,
            day: value.getDate(),
        };
    }

    const trimmedValue = value.trim();
    const brazilianMatch = trimmedValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (brazilianMatch) {
        const [, day, month, year] = brazilianMatch;
        return { year: Number(year), month: Number(month), day: Number(day) };
    }

    const isoMatch = trimmedValue.match(/^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/);
    if (isoMatch) {
        const [, year, month, day] = isoMatch;
        return { year: Number(year), month: Number(month), day: Number(day) };
    }

    const parsed = new Date(trimmedValue);
    if (Number.isNaN(parsed.getTime())) return null;

    return {
        year: parsed.getFullYear(),
        month: parsed.getMonth() + 1,
        day: parsed.getDate(),
    };
}

export function formatDateDisplay(value: string | Date | null | undefined): string {
    const parts = parseDateParts(value);
    if (!parts) return '';

    return `${pad(parts.day)}/${pad(parts.month)}/${parts.year}`;
}

export function formatDateInputValue(value: string | Date | null | undefined): string {
    const parts = parseDateParts(value);
    if (!parts) return '';

    return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

export function isSameCalendarMonth(value: string | Date | null | undefined, year: number, monthIndex: number): boolean {
    const parts = parseDateParts(value);
    if (!parts) return false;

    return parts.year === year && parts.month - 1 === monthIndex;
}

export function isSameCalendarDay(value: string | Date | null | undefined, year: number, monthIndex: number, day: number): boolean {
    const parts = parseDateParts(value);
    if (!parts) return false;

    return parts.year === year && parts.month - 1 === monthIndex && parts.day === day;
}