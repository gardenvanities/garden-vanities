import { CLOUDINARY_CONFIG, PRESETS, type PresetName } from "./cloudinary.config";

export const CLOUD_NAME = CLOUDINARY_CONFIG.cloudName;

interface TransformOption {
	width?: number;
	height?: number;
	crop?: "fill" | "fit" | "scale" | "thumb";
	quality?: "auto" | "auto:eco" | "auto:good" | "auto:best" | number;
	format?: "auto" | "webp" | "avif" | "jpg" | "png";
	preset?: PresetName;
}

export function buildCloudinaryUrl(publicId: string, options: TransformOption = {}): string {
	// If no publicId provided, return empty string
	if (!publicId) return "";

	// If publicId is already a URL, return it as-is
	if (publicId.startsWith("http://") || publicId.startsWith("https://")) {
		return publicId;
	}

	// If CLOUD_NAME is not set, return the publicId as-is (fallback)
	if (!CLOUD_NAME) {
		console.warn("CLOUD_NAME is not set, returning publicId as-is");
		return publicId;
	}

	// Apply preset if specified
	const finalOptions = options.preset ? { ...PRESETS[options.preset], ...options } : options;

	const {
		width,
		height,
		crop = "fill",
		quality = CLOUDINARY_CONFIG.defaultQuality,
		format = CLOUDINARY_CONFIG.defaultFormat
	} = finalOptions;

	const transforms: string[] = [];

	if (width) transforms.push(`w_${width}`);
	if (height) transforms.push(`h_${height}`);
	if (width || height) transforms.push(`c_${crop}`);
	transforms.push(`q_${quality}`);
	transforms.push(`f_${format}`);

	const transformString = transforms.join(",");

	return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformString}/${publicId}`;
}

export function buildSrcSet(
	publicId: string,
	widths: readonly number[] = CLOUDINARY_CONFIG.breakpoints
): string {
	return widths.map((w) => `${buildCloudinaryUrl(publicId, { width: w })} ${w}w`).join(", ");
}

/**
 * Generate a Low Quality Image Placeholder (LQIP) URL
 * Uses Cloudinary's blur and quality reduction for fast loading
 */
export function buildLQIP(publicId: string): string {
	if (!publicId || !CLOUD_NAME) return "";
	if (publicId.startsWith("http")) return publicId;

	const transforms = ["w_40", "q_auto:low", "f_auto", "e_blur:1000"].join(",");
	return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}

/**
 * Generate responsive image data for use in srcset/sizes
 */
export function getResponsiveImageData(
	publicId: string,
	options: TransformOption = {}
): {
	src: string;
	srcset: string;
	lqip: string;
	sizes: string;
} {
	return {
		src: buildCloudinaryUrl(publicId, options),
		srcset: buildSrcSet(publicId),
		lqip: buildLQIP(publicId),
		sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
	};
}
