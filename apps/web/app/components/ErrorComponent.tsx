"use client";

import Link from "next/link";

interface ErrorProps {
  error: string;
}

export default function ErrorComponent({ error }: ErrorProps) {
  return (
    <div className="text-white min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-300 via-gray-400 to-gray-700 p-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-xl text-center space-y-6 border border-white border-opacity-20">
        <h1 className="text-3xl font-bold text-red-300">
          Something went wrong
        </h1>
        <p className="text-lg text-gray-500">{error}</p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 bg-white text-gray-800 rounded-xl font-semibold shadow hover:bg-gray-100 transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
