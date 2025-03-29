"use client";

import React from "react";
import LoginButton from "./components/LoginButton";
import Loader from "../components/Loader";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { AuthStatus } from "../models/AuthStatus";

export default function LoginPage() {
  const { status } = useAuthRedirect({
    redirectIfAuthenticated: true,
    redirectTo: "/dashboard",
  });

  if (status === AuthStatus.Loading) return <Loader />;

  if (status === AuthStatus.Unauthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-300 via-gray-400 to-gray-700 p-4">
        <div className="w-full max-w-md bg-gray-800 bg-opacity-90 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-white border-opacity-10 flex justify-center">
          <div className="w-full flex flex-col items-center space-y-6">
            <h1 className="text-2xl font-bold text-white text-center">
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
