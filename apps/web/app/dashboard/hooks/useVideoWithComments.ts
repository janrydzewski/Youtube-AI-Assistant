import { useEffect, useState } from "react";
import { VideosBody, CommentBody } from "@shared/models/youtube";

export function useVideoWithComments(videoId?: string | string[]) {
  const [video, setVideo] = useState<VideosBody | null>(null);
  const [comments, setComments] = useState<CommentBody[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoId) return;

    const fetchData = async () => {
      try {
        const resVideo = await fetch(`/api/youtube/video?videoId=${videoId}`);
        if (!resVideo.ok) throw new Error("Error fetching video details");
        const videoData = await resVideo.json();
        setVideo(videoData);

        const resComments = await fetch(
          `/api/youtube/comments?videoId=${videoId}`
        );
        if (!resComments.ok) throw new Error("Error fetching comments");
        const commentsData = await resComments.json();
        setComments(commentsData.items || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [videoId]);

  return { video, comments, loading, error };
}
