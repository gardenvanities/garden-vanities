import { describe, it, expect } from "vitest";
import { stripMarkdown } from "./posts";

describe("stripMarkdown", () => {
	it("removes frontmatter blocks", () => {
		const input = "---\ntitle: Hello\n---\nContent";
		expect(stripMarkdown(input)).toBe("Content");
	});

	it("removes links but keeps text", () => {
		const input = "Click [here](https://example.com) to see.";
		expect(stripMarkdown(input)).toBe("Click here to see.");
	});

	it("removes images but keeps alt text", () => {
		const input = "Look at this: ![Alt text](image.jpg)";
		expect(stripMarkdown(input)).toBe("Look at this: Alt text");
	});

	it("removes formatting characters", () => {
		const input = "# Heading\n**Bold** and *Italic* and `Code`";
		expect(stripMarkdown(input)).toBe("Heading Bold and Italic and Code");
	});

	it("normalizes whitespace", () => {
		const input = "Line 1\n\nLine 2   Line 3";
		expect(stripMarkdown(input)).toBe("Line 1 Line 2 Line 3");
	});
});
