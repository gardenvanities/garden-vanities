import { describe, it, expect } from "vitest";
import { remarkCloudinaryImages } from "./remark-cloudinary-images";
import type { Image } from "mdast";

// Helper to run the plugin on a mock tree
function runPlugin(tree: { type: string; children: unknown[] }, cloudName = "test-cloud") {
	const transformer = remarkCloudinaryImages(cloudName);
	// @ts-expect-error - The plugin returns a transformer function that expects a specific Node type
	transformer()(tree);
}

describe("remarkCloudinaryImages", () => {
	it("transforms cloudinary:// URLs to full Cloudinary URLs", () => {
		const tree = {
			type: "root",
			children: [
				{
					type: "image",
					url: "cloudinary://my-image.jpg",
					alt: "Test"
				} as Image
			]
		};

		runPlugin(tree);

		const image = tree.children[0] as Image;
		expect(image.url).toBe(
			"https://res.cloudinary.com/test-cloud/image/upload/q_auto,f_auto/my-image.jpg"
		);
		// Wait, let's check the default logic in the file:
		// if (width) ... else -> transforms.push("q_auto"), transforms.push("f_auto")
		// no width/height/preset -> just q_auto, f_auto
		// Let's re-verify the implementation.
	});

	it("applies q_auto and f_auto by default if no params", () => {
		const tree = {
			type: "root",
			children: [{ type: "image", url: "cloudinary://img.jpg" } as Image]
		};

		runPlugin(tree);

		const image = tree.children[0] as Image;
		expect(image.url).toBe(
			"https://res.cloudinary.com/test-cloud/image/upload/q_auto,f_auto/img.jpg"
		);
	});

	it("ignores non-cloudinary URLs", () => {
		const originalUrl = "https://example.com/img.jpg";
		const tree = {
			type: "root",
			children: [{ type: "image", url: originalUrl } as Image]
		};

		runPlugin(tree);

		expect((tree.children[0] as Image).url).toBe(originalUrl);
	});

	it("applies query parameters (w, h, crop)", () => {
		const tree = {
			type: "root",
			children: [
				{ type: "image", url: "cloudinary://img.jpg?w=100&h=200&crop=fit" } as Image
			]
		};

		runPlugin(tree);

		const url = (tree.children[0] as Image).url;
		expect(url).toContain("w_100");
		expect(url).toContain("h_200");
		expect(url).toContain("c_fit");
	});

	it("applies presets", () => {
		const tree = {
			type: "root",
			children: [{ type: "image", url: "cloudinary://img.jpg?preset=thumbnail" } as Image]
		};

		runPlugin(tree);

		const url = (tree.children[0] as Image).url;
		expect(url).toContain("w_300");
		expect(url).toContain("h_300");
		expect(url).toContain("c_thumb");
	});

	it("handles URLs with existing query params correctly", () => {
		// e.g. publicId having special chars? 
		// The publicId logic: const [publicId, queryString] = urlWithoutProtocol.split("?");
		
		const tree = {
			type: "root",
			children: [{ type: "image", url: "cloudinary://folder/img.jpg?w=50" } as Image]
		};

		runPlugin(tree);

		expect((tree.children[0] as Image).url).toContain("/folder/img.jpg");
		expect((tree.children[0] as Image).url).toContain("w_50");
	});
});
