"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import VideoCard from "../../components/VideoCard";
import { VideosBody, CommentBody } from "@shared/models/youtube";
import Loader from "@/app/components/Loader";
import ErrorComponent from "@/app/components/ErrorComponent";

export default function VideoPage() {
  const { id } = useParams();
  const router = useRouter();

  const [video, setVideo] = useState<VideosBody | null>(null);
  const [comments, setComments] = useState<CommentBody[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const resVideo = await fetch(`/api/youtube/video?videoId=${id}`);
        if (!resVideo.ok) throw new Error("Error fetching video details");
        const videoData = await resVideo.json();
        setVideo(videoData);

        const resComments = await fetch(`/api/youtube/comments?videoId=${id}`);
        if (!resComments.ok) throw new Error("Error fetching comments");
        const commentsData = await resComments.json();
        console.log("commentsData:", commentsData);

        setComments(commentsData.items || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorComponent error={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-300 via-gray-400 to-gray-700 relative p-8">
      <header className="relative mb-8">
        <button
          onClick={() => router.push("/dashboard/videos")}
          className="btn btn-soft"
        >
          Back
        </button>
      </header>
      {video && (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <VideoCard video={video} />
        </div>
      )}
      <div>
        <div className="space-y-4 mt-10">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-white rounded shadow">
              <p className="font-semibold text-black">{comment.author.name}</p>
              <p className="text-gray-600">{comment.text}</p>
              <p className="text-gray-500 text-sm">
                {new Date(comment.publishedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
