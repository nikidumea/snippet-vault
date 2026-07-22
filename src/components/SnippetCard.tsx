import Link from "next/link";

type Tag = { id: string; name: string };
type Snippet = {
  id: string;
  title: string;
  language: string;
  tags: Tag[];
  updatedAt: string | Date;
};

export default function SnippetCard({ snippet }: { snippet: Snippet }) {
  return (
    <Link
      href={`/snippets/${snippet.id}`}
      className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-brand transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{snippet.title}</h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
          {snippet.language}
        </span>
      </div>
      {snippet.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {snippet.tags.map((tag) => (
            <span
              key={tag.id}
              className="text-xs bg-brand/10 text-brand px-2 py-0.5 rounded-full"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
