/**
 * Parses a comma/space separated tag input string into a clean, deduplicated
 * array of lowercase tag names. Pure function - no side effects, easy to test.
 *
 * @param input - Raw tag input, e.g. "React, hooks,  React  useState"
 * @returns Array of unique, trimmed, lowercase tag names.
 */
export function parseTags(input: string): string[] {
  if (!input) return [];
  const raw = input.split(/[,\n]+/);
  const cleaned = raw
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0);
  return Array.from(new Set(cleaned));
}
