/**
 * Command Palette Store — Svelte 5 Runes
 *
 * Manages the visibility state of the command palette.
 */

let isOpen = $state(false);

export const commandPalette = {
	get isOpen() {
		return isOpen;
	},
	set isOpen(value: boolean) {
		isOpen = value;
	},
	open() {
		isOpen = true;
	},
	close() {
		isOpen = false;
	},
	toggle() {
		isOpen = !isOpen;
	}
};
