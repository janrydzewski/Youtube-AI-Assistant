"use client";

import Link from "next/link";
import { colors } from "../styles/theme";

interface ErrorProps {
  error: string;
}

export default function ErrorComponent({ error }: ErrorProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: colors.backgroundSecondary }}
    >
      <div
        className="bg-white rounded-2xl shadow-md p-10 max-w-xl w-full text-center border"
        style={{ borderColor: colors.border }}
      >
        <h1
          className="text-3xl font-semibold mb-6"
          style={{ color: colors.textPrimary }}
        >
          Something went wrong
        </h1>
        <p className="text-md mb-10" style={{ color: colors.textSecondary }}>
          {error}
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 rounded-lg font-semibold shadow-sm transition"
          style={{
            backgroundColor: colors.accent,
            color: "#FFFFFF",
          }}
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
