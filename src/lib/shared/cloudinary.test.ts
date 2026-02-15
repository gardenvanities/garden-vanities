import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("$env/static/public", () => ({
	PUBLIC_CLOUDINARY_CLOUD_NAME: "test-cloud"
}));

import {
	buildCloudinaryUrl,
	buildSrcSet,
	buildLQIP,
	getResponsiveImageData,
	CLOUD_NAME
} from "./cloudinary";

describe("CLOUD_NAME", () => {
	it("resolves from mocked env", () => {
		expect(CLOUD_NAME).toBe("test-cloud");
	});
});

describe("buildCloudinaryUrl", () => {
	it("builds a full Cloudinary URL with default transforms", () => {
		const url = buildCloudinaryUrl("folder/image");
		expect(url).toBe(
			"https://res.cloudinary.com/test-cloud/image/upload/q_auto,f_auto/folder/image"
		);
	});

	it("includes width and height transforms", () => {
		const url = buildCloudinaryUrl("img", { width: 800, height: 600 });
		expect(url).toContain("w_800");
		expect(url).toContain("h_600");
		expect(url).toContain("c_fill");
	});

	it("uses custom crop mode", () => {
		const url = buildCloudinaryUrl("img", { width: 400, crop: "fit" });
		expect(url).toContain("c_fit");
	});

	it("returns empty string for empty publicId", () => {
		expect(buildCloudinaryUrl("")).toBe("");
	});

	it("returns HTTP URLs as-is", () => {
		const httpUrl = "https://example.com/image.jpg";
		expect(buildCloudinaryUrl(httpUrl)).toBe(httpUrl);
	});

	it("returns http URLs as-is", () => {
		const httpUrl = "http://example.com/image.jpg";
		expect(buildCloudinaryUrl(httpUrl)).toBe(httpUrl);
	});

	it("applies preset options", () => {
		const url = buildCloudinaryUrl("img", { preset: "thumbnail" });
		expect(url).toContain("w_300");
		expect(url).toContain("h_300");
		expect(url).toContain("c_thumb");
	});

	it("allows overriding preset values", () => {
		const url = buildCloudinaryUrl("img", { preset: "thumbnail", width: 500 });
		expect(url).toContain("w_500");
	});
});

describe("buildSrcSet", () => {
	it("generates srcset with default breakpoints", () => {
		const srcset = buildSrcSet("img");
		expect(srcset).toContain("400w");
		expect(srcset).toContain("800w");
		expect(srcset).toContain("1200w");
	});

	it("generates srcset with custom widths", () => {
		const srcset = buildSrcSet("img", [320, 640]);
		expect(srcset).toContain("320w");
		expect(srcset).toContain("640w");
		expect(srcset).not.toContain("400w");
	});

	it("each entry is a valid Cloudinary URL", () => {
		const srcset = buildSrcSet("img", [400]);
		const parts = srcset.split(", ");
		expect(parts[0]).toMatch(/^https:\/\/res\.cloudinary\.com\/test-cloud\/.+ 400w$/);
	});
});

describe("buildLQIP", () => {
	it("generates a low-quality blurred URL", () => {
		const url = buildLQIP("img");
		expect(url).toContain("w_40");
		expect(url).toContain("q_auto:low");
		expect(url).toContain("e_blur:1000");
	});

	it("returns empty string for empty publicId", () => {
		expect(buildLQIP("")).toBe("");
	});

	it("passes through HTTP URLs", () => {
		expect(buildLQIP("https://example.com/img.jpg")).toBe("https://example.com/img.jpg");
	});
});

describe("getResponsiveImageData", () => {
	it("returns an object with src, srcset, lqip, sizes", () => {
		const data = getResponsiveImageData("img");
		expect(data).toHaveProperty("src");
		expect(data).toHaveProperty("srcset");
		expect(data).toHaveProperty("lqip");
		expect(data).toHaveProperty("sizes");
	});

	it("src matches buildCloudinaryUrl output", () => {
		const data = getResponsiveImageData("img", { width: 800 });
		expect(data.src).toBe(buildCloudinaryUrl("img", { width: 800 }));
	});

	it("sizes contains responsive breakpoints", () => {
		const data = getResponsiveImageData("img");
		expect(data.sizes).toContain("max-width");
	});
});
