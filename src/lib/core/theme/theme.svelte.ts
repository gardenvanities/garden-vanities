export type Theme = "system" | "light" | "dark";

const STORAGE_KEY = "theme";

function getStoredTheme(): Theme {
	if (typeof window === "undefined") return "system";
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === "light" || stored === "dark") return stored;
	return "system";
}

let currentTheme = $state<Theme>(getStoredTheme());

export function getTheme(): Theme {
	return currentTheme;
}

export function setTheme(newTheme: Theme): void {
	currentTheme = newTheme;

	if (typeof window === "undefined") return;

	if (newTheme === "system") {
		localStorage.removeItem(STORAGE_KEY);
	} else {
		localStorage.setItem(STORAGE_KEY, newTheme);
	}

	applyTheme(newTheme);
}

export function applyTheme(theme: Theme): void {
	if (typeof document === "undefined") return;

	const html = document.documentElement;
	html.classList.remove("light", "dark");

	if (theme === "light") {
		html.classList.add("light");
	} else if (theme === "dark") {
		html.classList.add("dark");
	}
}

export function getResolvedTheme(): "light" | "dark" {
	if (typeof window === "undefined") return "dark";

	if (currentTheme !== "system") {
		return currentTheme;
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
