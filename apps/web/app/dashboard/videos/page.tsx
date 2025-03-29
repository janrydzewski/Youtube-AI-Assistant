"use client";

import { VideosResponse } from "@shared/models/youtube";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VideoCard from "../components/VideoCard";
import Link from "next/link";
import Loader from "@/app/components/Loader";
import ErrorComponent from "@/app/components/ErrorComponent";

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

  if (loading) return <Loader />;

  if (error) return <ErrorComponent error={error} />;

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
          <Link
            key={video.videoId}
            href={`/dashboard/videos/${video.videoId}`}
            className="cursor-pointer"
          >
            <VideoCard key={video.videoId} video={video} />
          </Link>
        ))}
      </div>
    </div>
  );
}
