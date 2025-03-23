"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import LoginButton from "./components/LoginButton";
import Loader from "../components/Loader";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [router, session]);

  if (status === "loading") {
    return <Loader />;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
        <h1 className="text-4xl font-bold mb-6">Witaj w aplikacji</h1>
        <p className="mb-8 text-lg">
          Zaloguj się przy użyciu Google, aby kontynuować.
        </p>
        <LoginButton />
      </div>
    );
  }

  return <Loader />;
}
