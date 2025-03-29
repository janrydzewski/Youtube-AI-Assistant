"use client";

import { VideosResponse } from "@shared/models/youtube";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VideosPage() {
  const [videosData, setVideosData] = useState<VideosResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/youtube/videos");
      if (!res.ok) {
        throw new Error("Error fetching videos");
      }
      const data: VideosResponse = await res.json();
      setVideosData(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-300 via-gray-400 to-gray-700 relative p-8">
      <header className="relative mb-8">
        <button onClick={() => router.push("/")} className="btn btn-soft">
          Back
        </button>
        <h1 className="text-5xl font-bold text-gray-800 text-center">
          {videosData?.channelName}
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videosData?.items.map((video) => (
          <div
            key={video.videoId}
            className="card bg-white shadow-md rounded-xl overflow-hidden"
          >
            <Image
              src={video.thumbnail.url}
              alt={video.title}
              width={video.thumbnail.width}
              height={video.thumbnail.height}
              className="w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-black">
                {video.title}
              </h2>
              <p className="text-gray-600 mb-2 line-clamp-2">
                {video.description}
              </p>
              <p className="text-gray-500 text-sm">
                {new Date(video.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
