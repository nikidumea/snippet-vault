"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Tag = { name: string };
type InitialValues = {
  id?: string;
  title: string;
  code: string;
  language: string;
  tags: Tag[];
};

export default function SnippetForm({
  initial,
}: {
  initial?: InitialValues;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [language, setLanguage] = useState(initial?.language ?? "");
  const [code, setCode] = useState(initial?.code ?? "");
  const [tags, setTags] = useState(
    initial?.tags.map((t) => t.name).join(", ") ?? ""
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const url = isEdit ? `/api/snippets/${initial!.id}` : "/api/snippets";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, code, language, tags }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    const saved = await res.json();
    router.push(`/snippets/${saved.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Language
        </label>
        <input
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          required
          placeholder="e.g. typescript, python, sql"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags (comma separated)
        </label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. react, hooks, performance"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Code
        </label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          rows={12}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="bg-brand hover:bg-brand-hover disabled:opacity-50 text-white px-4 py-2 rounded-md font-medium text-sm"
      >
        {submitting ? "Saving..." : isEdit ? "Save changes" : "Create snippet"}
      </button>
    </form>
  );
}
