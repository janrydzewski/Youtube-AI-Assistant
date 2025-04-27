"use client";

import React from "react";
import LoginButton from "./components/LoginButton";
import Loader from "../components/Loader";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { AuthStatus } from "../models/AuthStatus";
import { colors } from "../styles/theme";

export default function LoginPage() {
  const { status } = useAuthRedirect({
    redirectIfAuthenticated: true,
    redirectTo: "/dashboard",
  });

  if (status === AuthStatus.Loading) return <Loader />;

  if (status === AuthStatus.Unauthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: colors.backgroundSecondary }}
      >
        <div
          className="w-full max-w-md bg-white p-10 rounded-2xl shadow-md border"
          style={{
            borderColor: colors.border,
          }}
        >
          <div className="w-full flex flex-col items-center space-y-8">
            <h1
              className="text-3xl font-semibold text-center"
              style={{ color: colors.textPrimary }}
            >
              Welcome back
            </h1>
            <LoginButton />
          </div>
        </div>
      </div>
    );
  }

  return <Loader />;
}
