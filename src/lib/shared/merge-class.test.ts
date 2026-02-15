import { describe, it, expect } from "vitest";
import { cn } from "./merge-class";

describe("cn", () => {
	it("combines multiple class strings", () => {
		expect(cn("foo", "bar")).toBe("foo bar");
	});

	it("filters out falsy values", () => {
		expect(cn("foo", false, null, undefined, "bar")).toBe("foo bar");
	});

	it("handles conditional classes", () => {
		const isActive = true;
		expect(cn("base", isActive && "active")).toBe("base active");
	});

	it("resolves Tailwind conflicts (last wins)", () => {
		expect(cn("p-2", "p-4")).toBe("p-4");
	});

	it("resolves conflicting text colors", () => {
		expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
	});

	it("preserves non-conflicting classes", () => {
		const result = cn("p-2", "m-4", "text-sm");
		expect(result).toContain("p-2");
		expect(result).toContain("m-4");
		expect(result).toContain("text-sm");
	});

	it("handles empty input", () => {
		expect(cn()).toBe("");
	});
});
