"use client";

import { useParams, useRouter } from "next/navigation";
import VideoCard from "../../components/VideoCard";
import Loader from "@/app/components/Loader";
import ErrorComponent from "@/app/components/ErrorComponent";
import CommentCard from "../../components/CommentCard";
import { useVideoWithComments } from "../../hooks/useVideoWithComments";
import { colors } from "@/app/styles/theme";

export default function VideoPage() {
  const { id } = useParams();
  const router = useRouter();
  const { video, comments, loading, error } = useVideoWithComments(id);

  if (loading) return <Loader />;
  if (error) return <ErrorComponent error={error} />;

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: colors.backgroundSecondary }}
    >
      <header className="flex justify-between items-center mb-10">
        <button
          onClick={() => {
            const fromChannel = localStorage.getItem("selectedChannelId");
            if (fromChannel) {
              router.push("/dashboard/videos");
            } else {
              router.push("/dashboard");
            }
          }}
          className="px-4 py-2 rounded-lg font-semibold shadow-sm transition"
          style={{
            backgroundColor: colors.accent,
            color: "#FFFFFF",
          }}
        >
          Back
        </button>
      </header>

      {video && (
        <div className="max-w-3xl mx-auto mb-12">
          <VideoCard video={video} />
        </div>
      )}

      <section className="max-w-6xl mx-auto">
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: colors.textPrimary }}
        >
          Comments
        </h2>
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      </section>
    </div>
  );
}
