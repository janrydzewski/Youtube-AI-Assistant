"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [router, session]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Ładowanie...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <h1 className="text-4xl font-bold mb-6">Witaj w aplikacji</h1>
      <p className="mb-8 text-lg">
        Zaloguj się przy użyciu Google, aby kontynuować.
      </p>
      <button
        onClick={() => signIn("google")}
        className="bg-white text-black font-bold py-2 px-4 rounded"
      >
        Zaloguj się
      </button>
    </div>
  );
}
