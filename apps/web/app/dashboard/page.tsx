"use client";

import { useSession, signOut } from "next-auth/react";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";
import { AuthStatus } from "../models/AuthStatus";
import LinkLogo from "./components/LinkLogo";
import NextLogo from "./components/NextLogo";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === AuthStatus.Loading) {
    return <Loader />;
  }

  if (!session) return null;

  if (status === AuthStatus.Authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-gray-300 via-gray-400 to-gray-700">
        <button
          onClick={() => signOut()}
          className="absolute top-4 right-4 btn btn-error"
        >
          Wyloguj się
        </button>

        <div className="flex items-center justify-center h-screen">
          <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
            <div className="mb-6">
              <label className="block text-gray-800 text-xl font-semibold mb-2">
                Podaj nazwę kanału
              </label>
              <input
                type="text"
                placeholder="Wpisz nazwę kanału"
                className="input input-bordered w-full bg-gray-500"
              />
            </div>
            <div className="divider divider-secondary"></div>
            <div>
              <label className="block text-gray-800 text-xl font-semibold mb-2">
                Lub wklej link do filmu
              </label>
              <label className="input-bordered w-full input validator bg-gray-500">
                <LinkLogo />
                <input
                  type="url"
                  required
                  placeholder="https://"
                  pattern="^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9\-].*[a-zA-Z0-9])?\.)+[a-zA-Z].*$"
                  title="Must be valid URL"
                />
              </label>
              <p className="validator-hint">Must be valid URL</p>
              <div className="flex justify-center">
                <button className="btn btn-circle mt-6 size-12 bg-gray-700 text-white">
                  <NextLogo />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Loader />;
}
