
// Pastel gradient palettes - each has 2-3 colors for smooth gradients
const pastelGradients = [
	["oklch(85% 0.08 280)", "oklch(90% 0.06 320)", "oklch(88% 0.07 350)"], // lavender-pink
	["oklch(88% 0.07 200)", "oklch(85% 0.08 230)", "oklch(90% 0.05 180)"], // mint-cyan
	["oklch(90% 0.06 60)", "oklch(88% 0.08 30)", "oklch(85% 0.07 80)"],    // peach-coral
	["oklch(87% 0.07 140)", "oklch(90% 0.05 170)", "oklch(85% 0.06 120)"], // sage-green
	["oklch(88% 0.06 250)", "oklch(85% 0.08 290)", "oklch(90% 0.05 210)"], // sky-blue
	["oklch(90% 0.07 340)", "oklch(87% 0.06 10)", "oklch(88% 0.08 320)"],  // rose-blush
	["oklch(86% 0.08 90)", "oklch(90% 0.05 120)", "oklch(88% 0.06 60)"],   // lime-yellow
	["oklch(89% 0.05 300)", "oklch(85% 0.07 260)", "oklch(87% 0.06 330)"], // violet-purple
];

// Generate a consistent gradient based on a seed string (so it's the same on each load)
export function getGradientFromSeed(seed: string): string {
	if (!seed) return `linear-gradient(45deg, ${pastelGradients[0].join(", ")})`;
	
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		const char = seed.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash;
	}
	const index = Math.abs(hash) % pastelGradients.length;
	const colors = pastelGradients[index];
	const angle = (Math.abs(hash) % 360);
	return `linear-gradient(${angle}deg, ${colors.join(", ")})`;
}
