"use client";

import { signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";

export default function SignInButton({ session }: { session: Session | null }) {
  if (session?.user) {
    return (
      <button
        onClick={() => signOut()}
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        Sign out ({session.user.name})
      </button>
    );
  }
  return (
    <button
      onClick={() => signIn("github")}
      className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-md font-medium hover:bg-gray-700"
    >
      Sign in with GitHub
    </button>
  );
}
