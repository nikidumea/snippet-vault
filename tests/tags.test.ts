import { describe, it, expect } from "vitest";
import { parseTags } from "@/lib/tags";

describe("parseTags", () => {
  it("splits a comma separated string into trimmed lowercase tags", () => {
    expect(parseTags("React, Hooks, Performance")).toEqual([
      "react",
      "hooks",
      "performance",
    ]);
  });

  it("removes duplicate tags", () => {
    expect(parseTags("react, React, REACT")).toEqual(["react"]);
  });

  it("returns an empty array for empty input", () => {
    expect(parseTags("")).toEqual([]);
    expect(parseTags("   ")).toEqual([]);
  });

  it("ignores empty entries from stray commas", () => {
    expect(parseTags("react,, hooks,")).toEqual(["react", "hooks"]);
  });
});
