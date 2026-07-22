"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const [language, setLanguage] = useState(searchParams.get("language") ?? "");
  const [tag, setTag] = useState(searchParams.get("tag") ?? "");

  function applyFilters(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (language) params.set("language", language);
    if (tag) params.set("tag", tag);
    router.push(`/?${params.toString()}`);
  }

  return (
    <form
      onSubmit={applyFilters}
      className="flex flex-col sm:flex-row gap-2 mb-6"
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search title or code..."
        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
      />
      <input
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        placeholder="Language (e.g. typescript)"
        className="border border-gray-300 rounded-md px-3 py-2 text-sm sm:w-48"
      />
      <input
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        placeholder="Tag (e.g. hooks)"
        className="border border-gray-300 rounded-md px-3 py-2 text-sm sm:w-40"
      />
      <button
        type="submit"
        className="bg-gray-900 text-white text-sm px-4 py-2 rounded-md font-medium hover:bg-gray-700"
      >
        Filter
      </button>
    </form>
  );
}
