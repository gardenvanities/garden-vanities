import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public";

export const CLOUDINARY_CONFIG = {
	cloudName: PUBLIC_CLOUDINARY_CLOUD_NAME,
	breakpoints: [400, 800, 1200, 1600, 2400],
	defaultQuality: "auto" as const,
	defaultFormat: "auto" as const,
	fallbackImage: "/images/placeholder.svg"
} as const;

export const PRESETS = {
	thumbnail: {
		width: 300,
		height: 300,
		crop: "thumb" as const,
		quality: "auto" as const,
		format: "auto" as const
	},
	card: {
		width: 600,
		height: 400,
		crop: "fill" as const,
		quality: "auto" as const,
		format: "auto" as const
	},
	hero: {
		width: 1920,
		height: 1080,
		crop: "fill" as const,
		quality: "auto:eco" as const,
		format: "auto" as const
	},
	ogImage: {
		width: 1200,
		height: 630,
		crop: "fill" as const,
		quality: "auto:good" as const,
		format: "jpg" as const
	}
} as const;

export type PresetName = keyof typeof PRESETS;
