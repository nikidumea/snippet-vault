import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseTags } from "@/lib/tags";

async function getOwnedSnippet(id: string, userId: string) {
  const snippet = await prisma.snippet.findUnique({
    where: { id },
    include: { tags: true },
  });
  if (!snippet || snippet.userId !== userId) return null;
  return snippet;
}

// GET /api/snippets/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  const snippet = await getOwnedSnippet(params.id, userId);
  if (!snippet) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(snippet);
}

// PUT /api/snippets/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  const existing = await getOwnedSnippet(params.id, userId);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

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

  const updated = await prisma.snippet.update({
    where: { id: params.id },
    data: {
      title: title.trim(),
      code,
      language: language.trim(),
      tags: {
        set: [],
        connectOrCreate: tagNames.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
    include: { tags: true },
  });

  return NextResponse.json(updated);
}

// DELETE /api/snippets/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  const existing = await getOwnedSnippet(params.id, userId);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.snippet.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
