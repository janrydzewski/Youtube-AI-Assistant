"use client";

import { useParams, useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import ErrorComponent from "@/app/components/ErrorComponent";
import CommentCard from "../../components/CommentCard";
import { useVideoWithComments } from "../../hooks/useVideoWithComments";
import { colors } from "@/app/styles/theme";
import { useEffect, useRef } from "react";
import { YouTubePlayerHandle } from "../../components/YoutubePlayer";
import VideoCard from "../../components/VideoCard";

export default function VideoPage() {
  const { id } = useParams();
  const router = useRouter();
  const { video, comments, loading, error, loadMore, loadingMore, hasMore } =
    useVideoWithComments(id);

  const playerRef = useRef<YouTubePlayerHandle>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleSeek = (seconds: number) => {
    playerRef.current?.seekTo(seconds);
  };

  useEffect(() => {
    if (!sentinelRef.current) {
      console.log("Sentinel not ready yet.");
      return;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      const entry = entries[0];
      console.log("IntersectionObserver entry:", entry.isIntersecting);
      if (entry.isIntersecting && hasMore && !loadingMore) {
        console.log("Sentinel intersected, triggering loadMore");
        loadMore();
      }
    });

    observerRef.current.observe(sentinelRef.current);
    console.log("Observer attached.");

    return () => {
      observerRef.current?.disconnect();
      console.log("Observer disconnected.");
    };
  }, [hasMore, loadingMore, loadMore]);

  if (loading) return <Loader />;
  if (error) return <ErrorComponent error={error} />;

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: colors.backgroundSecondary }}
    >
      <header className="flex justify-between items-center mb-10">
        <button
          onClick={() => router.push("/dashboard/videos")}
          className="px-4 py-2 rounded-lg font-semibold shadow-sm transition"
          style={{ backgroundColor: colors.accent, color: "#FFFFFF" }}
        >
          Back
        </button>
      </header>

      {video && (
        <div className="max-w-3xl mx-auto mb-12">
          <VideoCard ref={playerRef} video={video} withPlayer />
        </div>
      )}

      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Comments</h2>

        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onSeek={handleSeek}
            />
          ))}
        </div>

        {!loading && !error && <div ref={sentinelRef} className="h-10"></div>}

        {loadingMore && (
          <div className="flex justify-center p-6">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        )}
      </section>
    </div>
  );
}
