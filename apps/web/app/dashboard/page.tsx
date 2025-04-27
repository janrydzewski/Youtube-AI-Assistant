"use client";

import { signOut } from "next-auth/react";
import Loader from "../components/Loader";
import LinkLogo from "./components/LinkLogo";
import NextLogo from "./components/NextLogo";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { AuthStatus } from "../models/AuthStatus";
import { useChannelForm } from "./hooks/useChannelForm";
import { colors } from "../styles/theme";

export default function DashboardPage() {
  const { session, status } = useAuthRedirect({
    redirectIfUnauthenticated: true,
    redirectTo: "/login",
  });
  const { channelName, setChannelName, videoUrl, setVideoUrl, handleSubmit } =
    useChannelForm();

  if (status === AuthStatus.Loading) return <Loader />;
  if (!session) return null;

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundColor: colors.backgroundSecondary }}
    >
      <header className="flex justify-end p-6">
        <button
          onClick={() => signOut()}
          className="px-5 py-2 rounded-lg font-semibold shadow-sm transition"
          style={{
            backgroundColor: colors.accent,
            color: "#FFFFFF",
          }}
        >
          Sign Out
        </button>
      </header>

      <div className="flex items-center justify-center h-[calc(100vh-96px)] px-4">
        <div
          className="w-full max-w-lg p-10 rounded-2xl shadow-md border"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border,
          }}
        >
          <h1
            className="text-2xl font-bold text-center mb-8"
            style={{ color: colors.textPrimary }}
          >
            Connect a channel or video
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label
                className="block text-lg font-medium mb-2"
                style={{ color: colors.textPrimary }}
              >
                Channel Name
              </label>
              <input
                type="text"
                placeholder="Type channel name"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-center">
              <span
                className="font-medium uppercase text-sm tracking-widest"
                style={{ color: colors.textSecondary }}
              >
                OR
              </span>
            </div>

            <div>
              <label
                className="block text-lg font-medium mb-2"
                style={{ color: colors.textPrimary }}
              >
                Video URL
              </label>
              <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3">
                <LinkLogo />
                <input
                  type="url"
                  placeholder="https://"
                  pattern="^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9\-].*[a-zA-Z0-9])?\.)+[a-zA-Z].*$"
                  title="Must be a valid URL"
                  className="flex-1 ml-3 bg-transparent outline-none border-none text-gray-800 placeholder-gray-400"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
              <p
                className="text-xs mt-1"
                style={{ color: colors.textSecondary }}
              >
                Must be a valid URL
              </p>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="p-4 rounded-full shadow-md transition"
                style={{
                  backgroundColor: colors.accent,
                  color: "#FFFFFF",
                }}
              >
                <NextLogo />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
