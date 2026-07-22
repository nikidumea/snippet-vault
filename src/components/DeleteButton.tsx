"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this snippet? This cannot be undone.")) return;
    setDeleting(true);
    const res = await fetch(`/api/snippets/${id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      alert("Failed to delete the snippet. Please try again.");
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}
