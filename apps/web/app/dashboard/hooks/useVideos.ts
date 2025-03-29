import { useEffect, useState } from "react";
import { VideosResponse } from "@shared/models/youtube";

export function useVideos() {
  const [videosData, setVideosData] = useState<VideosResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchVideos();
  }, []);

  return { videosData, loading, error };
}
