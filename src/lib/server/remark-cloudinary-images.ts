import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { Image } from "mdast";

const CLOUDINARY_PROTOCOL = "cloudinary://";


const PRESETS = {
	thumbnail: { width: 300, height: 300, crop: "thumb", quality: "auto", format: "auto" },
	card: { width: 600, height: 400, crop: "fill", quality: "auto", format: "auto" },
	hero: { width: 1920, height: 1080, crop: "fill", quality: "auto:eco", format: "auto" },
	ogImage: { width: 1200, height: 630, crop: "fill", quality: "auto:good", format: "jpg" }
} as const;

 
export function remarkCloudinaryImages(cloudName: string): Plugin {
	return () => {
		return (tree) => {
			visit(tree, "image", (node: Image) => {
				const url = node.url;

				
				if (!url.startsWith(CLOUDINARY_PROTOCOL)) {
					return;
				}

				
				const urlWithoutProtocol = url.slice(CLOUDINARY_PROTOCOL.length);
				const [publicId, queryString] = urlWithoutProtocol.split("?");

				if (!publicId) {
					console.warn(`Invalid cloudinary URL: ${url}`);
					return;
				}

				
				const params = new URLSearchParams(queryString || "");
				const preset = params.get("preset");
				const width = params.get("w");
				const height = params.get("h");
				const crop = params.get("crop");

				
				const transforms: string[] = [];

				
				if (preset && preset in PRESETS) {
					const presetConfig = PRESETS[preset as keyof typeof PRESETS];
					if (presetConfig.width) transforms.push(`w_${presetConfig.width}`);
					if (presetConfig.height) transforms.push(`h_${presetConfig.height}`);
					transforms.push(`c_${presetConfig.crop}`);
					transforms.push(`q_${presetConfig.quality}`);
					transforms.push(`f_${presetConfig.format}`);
				} else {
					
					if (width) transforms.push(`w_${width}`);
					if (height) transforms.push(`h_${height}`);
					if (width || height) transforms.push(`c_${crop || "fill"}`);
					transforms.push("q_auto");
					transforms.push("f_auto");
				}

				const transformString = transforms.join(",");

				
				const cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicId}`;

				
				node.url = cloudinaryUrl;
			});
		};
	};
}
