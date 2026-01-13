// src/lib/utils/reading-time.ts

const WORDS_PER_MINUTE = 200;

export function calculateReadingTime(content: string): number {
	const text = content.replace(/<[^>]*>/g, "").replace(/[#*`_~[\]]/g, "");
	const words = text.trim().split(/\s+/).length;
	return Math.ceil(words / WORDS_PER_MINUTE);
}

export function getReadingTimeLabel(minutes: number): "short" | "medium" | "long" {
	if (minutes <= 5) return "short"; // Adjusted from 15
	if (minutes <= 10) return "medium"; // Adjusted from 30
	return "long";
}

export function formatReadingTime(minutes: number, useGardenLabel = true): string {
	if (useGardenLabel) {
		return getReadingTimeLabel(minutes);
	}
	return `${minutes} min read`;
}
