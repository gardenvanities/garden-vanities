export function formatDate(date: string | Date, options: Intl.DateTimeFormatOptions = {}): string {
	const d = typeof date === "string" ? new Date(date) : date;

	const defaultOptions: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
		...options
	};

	return d.toLocaleDateString("pt-BR", defaultOptions);
}

export function formatShortDate(date: string | Date): string {
	return formatDate(date, {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}

export function formatRelativeDate(date: string | Date): string {
	const d = typeof date === "string" ? new Date(date) : date;
	const now = new Date();
	const diffInMs = now.getTime() - d.getTime();
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	if (diffInDays === 0) return "hoje";
	if (diffInDays === 1) return "ontem";
	if (diffInDays < 7) return `há ${diffInDays} dias`;
	if (diffInDays < 30) {
		const weeks = Math.floor(diffInDays / 7);
		return weeks === 1 ? "há 1 semana" : `há ${weeks} semanas`;
	}
	if (diffInDays < 365) {
		const months = Math.floor(diffInDays / 30);
		return months === 1 ? "há 1 mês" : `há ${months} meses`;
	}

	const years = Math.floor(diffInDays / 365);
	return years === 1 ? "há 1 ano" : `há ${years} anos`;
}

export function getISODate(date: string | Date): string {
	const d = typeof date === "string" ? new Date(date) : date;
	return d.toISOString().split("T")[0];
}

export function isValidDate(date: string): boolean {
	const d = new Date(date);
	return d instanceof Date && !isNaN(d.getTime());
}
