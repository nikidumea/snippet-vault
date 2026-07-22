import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SnippetForm from "@/components/SnippetForm";

export default async function NewSnippetPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New snippet</h1>
      <SnippetForm />
    </div>
  );
}
