// src/lib/utils/cloudinary.ts

import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public";
export const CLOUD_NAME = PUBLIC_CLOUDINARY_CLOUD_NAME;

interface TransformOption {
	width?: number;
	height?: number;
	crop?: "fill" | "fit" | "scale" | "thumb";
	quality?: "auto" | number;
	format?: "auto" | "webp" | "avif";
}

export function buildCloudinaryUrl(publicId: string, options: TransformOption = {}): string {
	const { width, height, crop = "fill", quality = "auto", format = "auto" } = options;

	const transforms: string[] = [];

	if (width) transforms.push(`w_${width}`);
	if (height) transforms.push(`h_${height}`);
	if (width || height) transforms.push(`c_${crop}`);
	transforms.push(`q_${quality}`);
	transforms.push(`f_${format}`);

	const transformString = transforms.join(",");

	return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformString}/${publicId}`;
}

export function buildSrcSet(publicId: string, widths: number[] = [400, 800, 1200, 1600]): string {
	return widths.map((w) => `${buildCloudinaryUrl(publicId, { width: w })} ${w}w`).join(", ");
}
