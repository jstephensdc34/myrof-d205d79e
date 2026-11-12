import { expect, it } from "bun:test";
import { parseCostEstimate } from "../src/utils/costEstimate";
it("preserves estimate text", () => expect(parseCostEstimate("$50 per visit")).toEqual({ text: "$50 per visit", url: "" }));
it("renders full cost estimate URLs as links", () => expect(parseCostEstimate("https://example.com/quote?id=123")).toEqual({ text: "", url: "https://example.com/quote?id=123" }));
it("supports bare domain links", () => expect(parseCostEstimate("example.com/quote").url).toBe("https://example.com/quote"));
it("never makes executable protocols clickable", () => expect(parseCostEstimate("javascript:alert(1)").url).toBe(""));
it("omits blank estimates", () => expect(parseCostEstimate(" ")).toEqual({ text: "", url: "" }));