import { signIn } from "next-auth/react";
import React from "react";
import GoogleLogo from "./GoogleLogo";

const LoginButton = () => {
  return (
    <button
      className="btn bg-white btn-wide btn-lg text-black border-[#e5e5e5] flex items-center gap-2 shadow-md rounded-lg"
      onClick={() => signIn("google")}
    >
      <GoogleLogo />
      Login with Google
    </button>
  );
};

export default LoginButton;
