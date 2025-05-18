import { useCallback, useEffect, useState } from "react";
import { VideosBody, CommentBody } from "@shared/models/youtube";

export function useVideoWithComments(videoId?: string | string[]) {
  const [video, setVideo] = useState<VideosBody | null>(null);
  const [comments, setComments] = useState<CommentBody[]>([]);
  const [pageToken, setPageToken] = useState<string | null>(null);
  const [realTotalResults, setRealTotalResults] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (!videoId || !pageToken) {
      console.log("No videoId or pageToken, skipping loadMore.");
      return;
    }

    setLoadingMore(true);
    try {
      const res = await fetch(
        `/api/youtube/comments?videoId=${videoId}&pageToken=${pageToken}`
      );
      if (!res.ok) throw new Error("Error fetching more comments");

      const commentsData = await res.json();

      if (
        !commentsData.pageInfo?.nextPageToken ||
        commentsData.items.length === 0
      ) {
        console.log("No more comments to load");
        setPageToken(null);
        return;
      }

      if (commentsData.pageInfo.nextPageToken === pageToken) {
        console.warn("Same page token received, stopping infinite loop");
        setPageToken(null);
        return;
      }

      setComments((prev) => [...prev, ...(commentsData.items || [])]);
      setPageToken(commentsData.pageInfo.nextPageToken || null);
    } catch (err) {
      console.error("Error loading more comments:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [videoId, pageToken]);
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
        setPageToken(commentsData.pageInfo?.nextPageToken || null);
        setRealTotalResults(commentsData.realTotalResults || null);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [videoId]);

  const hasMore =
    (pageToken !== null && pageToken !== undefined) ||
    (realTotalResults !== null && comments.length < realTotalResults);

  return {
    video,
    comments,
    loading,
    error,
    loadMore,
    loadingMore,
    hasMore,
    realTotalResults,
  };
}
