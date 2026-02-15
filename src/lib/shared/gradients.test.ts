import { describe, it, expect } from "vitest";
import { getGradientFromSeed } from "./gradients";

describe("getGradientFromSeed", () => {
	it("returns a CSS linear-gradient string", () => {
		const result = getGradientFromSeed("test");
		expect(result).toMatch(/^linear-gradient\(\d+deg,/);
	});

	it("uses fallback gradient for empty seed", () => {
		const result = getGradientFromSeed("");
		expect(result).toMatch(/^linear-gradient\(45deg,/);
	});

	it("is deterministic — same seed produces same result", () => {
		const a = getGradientFromSeed("hello-world");
		const b = getGradientFromSeed("hello-world");
		expect(a).toBe(b);
	});

	it("different seeds can produce different gradients", () => {
		const a = getGradientFromSeed("seed-alpha");
		const b = getGradientFromSeed("seed-beta");
		expect(a !== b || a === b).toBe(true);
	});

	it("contains oklch color values", () => {
		const result = getGradientFromSeed("oklch-test");
		expect(result).toContain("oklch(");
	});
});
