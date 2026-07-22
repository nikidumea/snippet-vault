import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SnippetForm from "@/components/SnippetForm";
import DeleteButton from "@/components/DeleteButton";

export default async function SnippetPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/");

  const userId = (session.user as { id: string }).id;

  const snippet = await prisma.snippet.findUnique({
    where: { id: params.id },
    include: { tags: true },
  });

  if (!snippet || snippet.userId !== userId) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit snippet</h1>
        <DeleteButton id={snippet.id} />
      </div>
      <SnippetForm
        initial={{
          id: snippet.id,
          title: snippet.title,
          code: snippet.code,
          language: snippet.language,
          tags: snippet.tags,
        }}
      />
    </div>
  );
}
