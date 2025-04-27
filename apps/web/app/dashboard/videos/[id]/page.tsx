"use client";

import { useParams, useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import ErrorComponent from "@/app/components/ErrorComponent";
import CommentCard from "../../components/CommentCard";
import { useVideoWithComments } from "../../hooks/useVideoWithComments";
import { colors } from "@/app/styles/theme";
import { useRef } from "react";
import { YouTubePlayerHandle } from "../../components/YoutubePlayer";
import VideoCard from "../../components/VideoCard";

export default function VideoPage() {
  const { id } = useParams();
  const router = useRouter();
  const { video, comments, loading, error } = useVideoWithComments(id);
  const playerRef = useRef<YouTubePlayerHandle>(null);

  if (loading) return <Loader />;
  if (error) return <ErrorComponent error={error} />;

  const handleSeek = (seconds: number) => {
    playerRef.current?.seekTo(seconds);
  };

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
      </section>
    </div>
  );
}
