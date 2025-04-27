import React from "react";
import { colors } from "../styles/theme";

const Loader = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: colors.backgroundSecondary }}
    >
      <div
        className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center space-y-6 border"
        style={{ borderColor: colors.border }}
      >
        <span
          className="loading loading-dots loading-lg"
          style={{ color: colors.accent }}
        ></span>
        <p
          className="text-lg font-medium"
          style={{ color: colors.textPrimary }}
        >
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loader;
