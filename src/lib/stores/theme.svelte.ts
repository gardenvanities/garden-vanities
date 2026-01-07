/**
 * Theme Store — Svelte 5 Runes
 *
 * Manages theme state with localStorage persistence.
 * Supports: 'system' | 'light' | 'dark'
 */

export type Theme = "system" | "light" | "dark";

const STORAGE_KEY = "theme";

// Get initial theme from localStorage (client-side only)
function getStoredTheme(): Theme {
	if (typeof window === "undefined") return "system";
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === "light" || stored === "dark") return stored;
	return "system";
}

// Create reactive state using Svelte 5 module-level $state
let currentTheme = $state<Theme>(getStoredTheme());

/**
 * Get the current theme preference
 */
export function getTheme(): Theme {
	return currentTheme;
}

/**
 * Set theme and persist to localStorage
 */
export function setTheme(newTheme: Theme): void {
	currentTheme = newTheme;

	if (typeof window === "undefined") return;

	// Persist to localStorage
	if (newTheme === "system") {
		localStorage.removeItem(STORAGE_KEY);
	} else {
		localStorage.setItem(STORAGE_KEY, newTheme);
	}

	// Apply to document
	applyTheme(newTheme);
}

/**
 * Apply theme class to document.documentElement
 */
export function applyTheme(theme: Theme): void {
	if (typeof document === "undefined") return;

	const html = document.documentElement;
	html.classList.remove("light", "dark");

	if (theme === "light") {
		html.classList.add("light");
	} else if (theme === "dark") {
		html.classList.add("dark");
	}
	// 'system' = no class, CSS handles via prefers-color-scheme
}

/**
 * Get the resolved theme (what's actually displayed)
 * Useful for showing the correct icon when in 'system' mode
 */
export function getResolvedTheme(): "light" | "dark" {
	if (typeof window === "undefined") return "dark";

	if (currentTheme !== "system") {
		return currentTheme;
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
