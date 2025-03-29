"use client";

import Link from "next/link";

interface ErrorProps {
  error: string;
}

export default function ErrorComponent({ error }: ErrorProps) {
  return (
    <div className="text-white min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-300 via-gray-400 to-gray-700 p-4">
      <div className="bg-gray-800 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl p-10 max-w-xl w-full text-center border border-white border-opacity-10">
        <h1 className="text-3xl font-bold text-white mb-4">
          Something went wrong
        </h1>
        <p className="text-md text-gray-300 mb-8">{error}</p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold shadow hover:bg-gray-600 transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
