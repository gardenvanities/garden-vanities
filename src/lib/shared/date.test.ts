import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
	formatDate,
	formatShortDate,
	formatRelativeDate,
	getISODate,
	isValidDate
} from "./date";

describe("formatDate", () => {
	it("formats an ISO string to pt-BR long format", () => {
		const result = formatDate("2025-06-15T12:00:00");
		expect(result).toContain("2025");
		expect(result).toContain("15");
	});

	it("formats a Date object", () => {
		const result = formatDate(new Date("2025-01-01T12:00:00"));
		expect(result).toContain("2025");
	});

	it("accepts custom Intl options", () => {
		const result = formatDate("2025-03-10T12:00:00", { month: "numeric" });
		expect(result).not.toContain("março");
	});
});

describe("formatShortDate", () => {
	it("returns a shorter date with abbreviated month", () => {
		const result = formatShortDate("2025-06-15T12:00:00");
		expect(result).toContain("2025");
		expect(result).toContain("15");
	});
});

describe("formatRelativeDate", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2025-07-15T12:00:00Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("returns 'hoje' for today", () => {
		expect(formatRelativeDate("2025-07-15T10:00:00Z")).toBe("hoje");
	});

	it("returns 'ontem' for yesterday", () => {
		expect(formatRelativeDate("2025-07-14T10:00:00Z")).toBe("ontem");
	});

	it("returns 'há X dias' for 2-6 days ago", () => {
		expect(formatRelativeDate("2025-07-12T10:00:00Z")).toBe("há 3 dias");
	});

	it("returns 'há 1 semana' for 7-13 days ago", () => {
		expect(formatRelativeDate("2025-07-08T10:00:00Z")).toBe("há 1 semana");
	});

	it("returns 'há X semanas' for 14+ days ago", () => {
		expect(formatRelativeDate("2025-07-01T10:00:00Z")).toBe("há 2 semanas");
	});

	it("returns 'há 1 mês' for ~30 days ago", () => {
		expect(formatRelativeDate("2025-06-15T10:00:00Z")).toBe("há 1 mês");
	});

	it("returns 'há X meses' for multiple months", () => {
		expect(formatRelativeDate("2025-04-15T10:00:00Z")).toBe("há 3 meses");
	});

	it("returns 'há 1 ano' for ~365 days ago", () => {
		expect(formatRelativeDate("2024-07-15T10:00:00Z")).toBe("há 1 ano");
	});

	it("returns 'há X anos' for multiple years", () => {
		expect(formatRelativeDate("2023-01-01T10:00:00Z")).toBe("há 2 anos");
	});
});

describe("getISODate", () => {
	it("extracts YYYY-MM-DD from an ISO string", () => {
		expect(getISODate("2025-06-15T14:30:00Z")).toBe("2025-06-15");
	});

	it("extracts YYYY-MM-DD from a Date object", () => {
		expect(getISODate(new Date("2025-01-01T00:00:00Z"))).toBe("2025-01-01");
	});
});

describe("isValidDate", () => {
	it("returns true for a valid ISO date string", () => {
		expect(isValidDate("2025-06-15")).toBe(true);
	});

	it("returns true for a valid datetime string", () => {
		expect(isValidDate("2025-06-15T14:30:00Z")).toBe(true);
	});

	it("returns false for an invalid string", () => {
		expect(isValidDate("not-a-date")).toBe(false);
	});

	it("returns false for an empty string", () => {
		expect(isValidDate("")).toBe(false);
	});
});
