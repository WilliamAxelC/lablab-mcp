import { describe, it, expect } from "vitest";
import { extractBalancedJson, formatTimeLeft } from "../parser.js";

describe("extractBalancedJson", () => {
  it("extracts balanced JSON objects", () => {
    const raw = 'prefix {"a": 1, "b": {"c": [2, 3]}} suffix';
    const parsed = extractBalancedJson(raw, raw.indexOf("{"));
    expect(parsed).toEqual({ a: 1, b: { c: [2, 3] } });
  });

  it("handles strings with braces inside quotes", () => {
    const raw = 'key: {"title": "Hello {World}", "count": 42}';
    const parsed = extractBalancedJson(raw, raw.indexOf("{"));
    expect(parsed).toEqual({ title: "Hello {World}", count: 42 });
  });

  it("extracts balanced arrays", () => {
    const raw = 'items: [1, {"x": 2}, 3]';
    const parsed = extractBalancedJson(raw, raw.indexOf("["));
    expect(parsed).toEqual([1, { x: 2 }, 3]);
  });
});

describe("formatTimeLeft", () => {
  it("returns Ended for past dates", () => {
    const past = new Date(Date.now() - 100000).toISOString();
    expect(formatTimeLeft(past)).toBe("Ended");
  });

  it("returns human formatted diff for future dates", () => {
    const future = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3600000).toISOString();
    const result = formatTimeLeft(future);
    expect(result).toContain("d");
    expect(result).toContain("remaining");
  });

  it("handles empty or invalid inputs", () => {
    expect(formatTimeLeft(undefined)).toBe("TBA");
  });
});
