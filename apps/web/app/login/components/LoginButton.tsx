import { signIn } from "next-auth/react";
import React from "react";
import GoogleLogo from "./GoogleLogo";
import { colors } from "@/app/styles/theme";

const LoginButton = () => {
  return (
    <button
      className="btn btn-wide btn-lg flex items-center gap-3 rounded-lg shadow-sm border"
      style={{
        backgroundColor: colors.background,
        color: colors.textPrimary,
        borderColor: colors.border,
      }}
      onClick={() => signIn("google")}
    >
      <GoogleLogo />
      Sign in with Google
    </button>
  );
};

export default LoginButton;
