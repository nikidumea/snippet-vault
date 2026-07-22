import { describe, it, expect } from "vitest";
import { filterSnippets, type SnippetLike } from "@/lib/filter";

const snippets: SnippetLike[] = [
  {
    title: "Debounce hook",
    code: "function useDebounce() { ... }",
    language: "typescript",
    tags: [{ name: "react" }, { name: "hooks" }],
  },
  {
    title: "Quick sort",
    code: "def quicksort(arr): ...",
    language: "python",
    tags: [{ name: "algorithms" }],
  },
  {
    title: "Fetch wrapper",
    code: "async function apiFetch(url) { ... }",
    language: "typescript",
    tags: [{ name: "fetch" }, { name: "utils" }],
  },
];

describe("filterSnippets", () => {
  it("returns all snippets when no filters are given", () => {
    expect(filterSnippets(snippets, {})).toHaveLength(3);
  });

  it("filters by query matching the title", () => {
    const result = filterSnippets(snippets, { query: "debounce" });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Debounce hook");
  });

  it("filters by query matching the code", () => {
    const result = filterSnippets(snippets, { query: "quicksort" });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Quick sort");
  });

  it("filters by language", () => {
    const result = filterSnippets(snippets, { language: "typescript" });
    expect(result).toHaveLength(2);
  });

  it("filters by tag", () => {
    const result = filterSnippets(snippets, { tag: "hooks" });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Debounce hook");
  });

  it("combines multiple filters", () => {
    const result = filterSnippets(snippets, {
      language: "typescript",
      tag: "fetch",
    });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Fetch wrapper");
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterSnippets(snippets, { language: "rust" })).toHaveLength(0);
  });
});
