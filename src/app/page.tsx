import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SnippetCard from "@/components/SnippetCard";
import SearchFilterBar from "@/components/SearchFilterBar";
import SignInButton from "@/components/SignInButton";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { query?: string; language?: string; tag?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="text-center py-24">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Welcome to SnippetVault
        </h1>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Save, tag and search your favorite code snippets - all in one
          place. Sign in with GitHub to get started.
        </p>
        <div className="inline-block">
          <SignInButton session={null} />
        </div>
      </div>
    );
  }

  const userId = (session.user as { id: string }).id;
  const { query, language, tag } = searchParams;

  const snippets = await prisma.snippet.findMany({
    where: {
      userId,
      ...(language ? { language: { equals: language, mode: "insensitive" } } : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { code: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(tag ? { tags: { some: { name: tag.toLowerCase() } } } : {}),
    },
    include: { tags: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My snippets</h1>
      <SearchFilterBar />
      {snippets.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No snippets yet. Click "+ New snippet" to add your first one.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {snippets.map((snippet: (typeof snippets)[number]) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>
      )}
    </div>
  );
}
