import { useEffect, useState } from "react";
import { VideosResponse } from "@shared/models/youtube";

const CACHE_TTL = 10 * 60 * 1000;

export function useVideos() {
  const [videosData, setVideosData] = useState<VideosResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const channelId =
    typeof window !== "undefined"
      ? localStorage.getItem("selectedChannelId")
      : null;

  useEffect(() => {
    if (!channelId) {
      setError("No channel selected");
      setLoading(false);
      return;
    }

    const fetchVideos = async () => {
      try {
        const cacheKey = `videos_${channelId}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
          const { timestamp, data } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            setVideosData(data);
            setLoading(false);
            return;
          }
        }

        const res = await fetch("/api/youtube/videos");
        if (!res.ok) throw new Error("Error fetching videos");

        const data: VideosResponse = await res.json();
        setVideosData(data);

        localStorage.setItem(
          cacheKey,
          JSON.stringify({ timestamp: Date.now(), data })
        );
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [channelId]);

  return { videosData, loading, error };
}
