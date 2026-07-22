import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseTags } from "@/lib/tags";

// GET /api/snippets?query=&language=&tag=
// Lists the current user's snippets, optionally filtered.
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") ?? undefined;
  const language = searchParams.get("language") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;

  const userId = (session.user as { id: string }).id;

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

  return NextResponse.json(snippets);
}

// POST /api/snippets
// Creates a new snippet for the current user.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const body = await req.json();
  const { title, code, language, tags } = body as {
    title?: string;
    code?: string;
    language?: string;
    tags?: string;
  };

  if (!title?.trim() || !code?.trim() || !language?.trim()) {
    return NextResponse.json(
      { error: "title, code and language are required" },
      { status: 400 }
    );
  }

  const tagNames = parseTags(tags ?? "");

  const snippet = await prisma.snippet.create({
    data: {
      title: title.trim(),
      code,
      language: language.trim(),
      userId,
      tags: {
        connectOrCreate: tagNames.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
    include: { tags: true },
  });

  return NextResponse.json(snippet, { status: 201 });
}
