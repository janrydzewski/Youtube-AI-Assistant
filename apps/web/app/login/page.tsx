"use client";

import React from "react";
import { useSession } from "next-auth/react";
import LoginButton from "./components/LoginButton";
import Loader from "../components/Loader";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { AuthStatus } from "../models/AuthStatus";

export default function LoginPage() {
  const { status } = useSession();
  useAuthRedirect("/dashboard");

  if (status === AuthStatus.Loading) {
    return <Loader />;
  }

  if (status === AuthStatus.Unauthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-4">
        <div className="bg-white w-full max-w-xl rounded-3xl p-16 shadow-xl flex overflow-hidden justify-center">
          <LoginButton />
        </div>
      </div>
    );
  }

  return <Loader />;
}
