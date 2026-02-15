import { describe, it, expect, vi } from "vitest";
import { setCacheHeaders, resolveResourceType } from "./utils";

describe("setCacheHeaders", () => {
	it("sets default cache headers (1h/24h)", () => {
		const setHeaders = vi.fn();
		setCacheHeaders(setHeaders);
		expect(setHeaders).toHaveBeenCalledWith({
			"cache-control": "max-age=3600, s-maxage=86400"
		});
	});

	it("sets custom cache headers", () => {
		const setHeaders = vi.fn();
		setCacheHeaders(setHeaders, 60, 120);
		expect(setHeaders).toHaveBeenCalledWith({
			"cache-control": "max-age=60, s-maxage=120"
		});
	});
});

describe("resolveResourceType", () => {
	it("resolves valid folder names to types", () => {
		expect(resolveResourceType("books")).toBe("book");
		expect(resolveResourceType("films")).toBe("film");
		expect(resolveResourceType("series-tv")).toBe("tv-series");
		expect(resolveResourceType("music")).toBe("album");
		expect(resolveResourceType("articles")).toBe("article");
		expect(resolveResourceType("research")).toBe("paper");
	});

	it("returns null for unknown folders", () => {
		expect(resolveResourceType("unknown")).toBe(null);
		expect(resolveResourceType("")).toBe(null);
	});
});
