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
      if (!res.ok) throw new Error("Error fetching videos");
      const data: VideosResponse = await res.json();
      setVideosData(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorComponent error={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-300 via-gray-400 to-gray-700 p-6">
      <header className="relative mb-10 h-12">
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow transition absolute left-0 top-1/2 transform -translate-y-1/2"
        >
          Back to Dashboard
        </button>
        <h1 className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-white">
          {videosData?.channelName}
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videosData?.items.map((video) => (
          <Link
            key={video.videoId}
            href={`/dashboard/videos/${video.videoId}`}
            className="cursor-pointer"
          >
            <VideoCard video={video} />
          </Link>
        ))}
      </div>
    </div>
  );
}
