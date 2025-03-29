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
      console.log("Video URL submitted:", videoUrl);
      router.push("/videos");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-300 via-gray-400 to-gray-700 relative">
      <header className="flex justify-end p-4">
        <button onClick={() => signOut()} className="btn btn-error">
          Sign Out
        </button>
      </header>
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <form onSubmit={handleChannelSubmit}>
            <div className="mb-6">
              <label className="block text-gray-800 text-xl font-semibold mb-2">
                Enter channel name
              </label>
              <input
                type="text"
                placeholder="Type channel name"
                className="input input-bordered w-full bg-gray-100"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />
            </div>
            <div className="divider divider-secondary">or</div>
            <div className="mb-6">
              <label className="block text-gray-800 text-xl font-semibold mb-2">
                Or paste video link
              </label>
              <label className="input input-bordered w-full bg-gray-100 flex items-center">
                <LinkLogo />
                <input
                  type="url"
                  placeholder="https://"
                  pattern="^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9\-].*[a-zA-Z0-9])?\.)+[a-zA-Z].*$"
                  title="Must be a valid URL"
                  className="flex-1 ml-2 bg-transparent outline-none border-none"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">Must be a valid URL</p>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="btn btn-circle mt-6 bg-gray-700 text-white"
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
