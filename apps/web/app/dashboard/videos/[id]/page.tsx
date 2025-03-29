"use client";

import { useParams, useRouter } from "next/navigation";
import VideoCard from "../../components/VideoCard";
import Loader from "@/app/components/Loader";
import ErrorComponent from "@/app/components/ErrorComponent";
import CommentCard from "../../components/CommentCard";
import { useVideoWithComments } from "../../hooks/useVideoWithComments";

export default function VideoPage() {
  const { id } = useParams();
  const router = useRouter();

  const { video, comments, loading, error } = useVideoWithComments(id);

  if (loading) return <Loader />;
  if (error) return <ErrorComponent error={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-300 via-gray-400 to-gray-700 p-6">
      <header className="flex justify-between items-center mb-10">
        <button
          onClick={() => router.push("/dashboard/videos")}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow transition"
        >
          Back to Videos
        </button>
      </header>

      {video && (
        <div className="max-w-3xl mx-auto mb-12">
          <VideoCard video={video} />
        </div>
      )}

      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Comments</h2>
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      </section>
    </div>
  );
}
