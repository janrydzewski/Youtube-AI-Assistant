/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <Loader />;
  }

  if (!session) return null;

  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 transition-colors duration-200 px-4 py-2 rounded-md"
          >
            Wyloguj się
          </button>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Informacje o użytkowniku
          </h2>
          <div className="flex items-center space-x-4">
            {session.user?.image && (
              <img
                src={session.user.image}
                alt="Avatar"
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <p className="text-xl">{session.user?.name}</p>
              <p className="text-gray-400">{session.user?.email}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Operacje</h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/add-comment"
                className="text-blue-400 hover:underline"
              >
                Dodaj komentarz
              </Link>
            </li>
            <li>
              <Link href="/add-reply" className="text-blue-400 hover:underline">
                Dodaj odpowiedź
              </Link>
            </li>
          </ul>
        </section>
      </div>
    );
  }

  return <Loader />;
}
