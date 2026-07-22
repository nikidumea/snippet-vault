export type SnippetLike = {
  title: string;
  code: string;
  language: string;
  tags: { name: string }[];
};

/**
 * Filters a list of snippets by a free-text query, a language, and a tag.
 * Pure function used both by the API route and by unit tests.
 *
 * @param snippets - The full list of snippets to filter.
 * @param options - Optional filters: query (matches title/code), language, tag.
 * @returns The filtered list of snippets.
 */
export function filterSnippets<T extends SnippetLike>(
  snippets: T[],
  options: { query?: string; language?: string; tag?: string }
): T[] {
  const query = options.query?.trim().toLowerCase();
  const language = options.language?.trim().toLowerCase();
  const tag = options.tag?.trim().toLowerCase();

  return snippets.filter((snippet) => {
    if (
      query &&
      !snippet.title.toLowerCase().includes(query) &&
      !snippet.code.toLowerCase().includes(query)
    ) {
      return false;
    }
    if (language && snippet.language.toLowerCase() !== language) {
      return false;
    }
    if (tag && !snippet.tags.some((t) => t.name.toLowerCase() === tag)) {
      return false;
    }
    return true;
  });
}
