"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";
import { AuthStatus } from "../models/AuthStatus";
import LinkLogo from "./components/LinkLogo";
import NextLogo from "./components/NextLogo";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [channelName, setChannelName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === AuthStatus.Loading) {
    return <Loader />;
  }

  if (!session) return null;

  const handleChannelSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!channelName.trim() && !videoUrl.trim()) {
      alert("Please enter a channel name or a video URL");
      return;
    }
    if (channelName.trim()) {
      try {
        const res = await fetch("/api/youtube/set-channel-id", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ handle: channelName.trim() }),
        });
        if (!res.ok) throw new Error("Error setting channel");
        router.push("/dashboard/videos");
      } catch (error) {
        console.error("Error: ", error);
      }
    } else if (videoUrl.trim()) {
      router.push("/videos");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-300 via-gray-400 to-gray-700 relative">
      <header className="flex justify-end p-6">
        <button
          onClick={() => signOut()}
          className="bg-white text-gray-800 font-semibold px-5 py-2 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Sign Out
        </button>
      </header>

      <div className="flex items-center justify-center h-[calc(100vh-96px)] px-4">
        <div className="w-full max-w-lg bg-gray-800 bg-opacity-90 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-white border-opacity-10">
          <h1 className="text-2xl font-bold text-white text-center mb-8">
            Connect a channel or video
          </h1>

          <form onSubmit={handleChannelSubmit} className="space-y-8">
            <div>
              <label className="block text-white text-lg font-medium mb-2">
                Channel Name
              </label>
              <input
                type="text"
                placeholder="Type channel name"
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-center">
              <span className="text-gray-300 font-medium uppercase text-sm tracking-widest">
                OR
              </span>
            </div>

            <div>
              <label className="block text-white text-lg font-medium mb-2">
                Video URL
              </label>
              <div className="flex items-center bg-gray-700 rounded-lg px-4 py-3">
                <LinkLogo />
                <input
                  type="url"
                  placeholder="https://"
                  pattern="^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9\-].*[a-zA-Z0-9])?\.)+[a-zA-Z].*$"
                  title="Must be a valid URL"
                  className="flex-1 ml-3 bg-transparent outline-none border-none text-white placeholder-gray-400"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Must be a valid URL</p>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-full shadow-lg transition"
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
