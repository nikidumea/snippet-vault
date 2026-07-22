import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignInButton from "./SignInButton";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b bg-white">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-gray-900">
          SnippetVault
        </Link>
        <div className="flex items-center gap-4">
          {session?.user && (
            <Link
              href="/snippets/new"
              className="text-sm bg-brand hover:bg-brand-hover text-white px-3 py-1.5 rounded-md font-medium"
            >
              + New snippet
            </Link>
          )}
          <SignInButton session={session} />
        </div>
      </div>
    </header>
  );
}
