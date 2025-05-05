"use client";

import { parseCommentText } from "@/app/utils/parseCommentText";
import { CommentBody } from "@shared/models/youtube";
import { useState } from "react";
import RefreshIcon from "@/app/components/icons/RefreshIcon";

interface CommentCardProps {
  comment: CommentBody;
  onSeek?: (seconds: number) => void;
}

export default function CommentCard({ comment, onSeek }: CommentCardProps) {
  const [suggestedReply, setSuggestedReply] = useState<string | null>(null);
  const [loadingReply, setLoadingReply] = useState(false);

  const generateReply = async () => {
    setLoadingReply(true);
    try {
      const res = await fetch("/api/deepseek/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: comment.text, tone: "friendly" }),
      });

      if (!res.ok) throw new Error("Failed to generate reply");

      const data = await res.json();
      setSuggestedReply(data.reply);
    } catch (error) {
      console.error("Error generating reply:", error);
      setSuggestedReply("Failed to generate reply. Try again.");
    } finally {
      setLoadingReply(false);
    }
  };

  return (
    <div className="relative bg-white p-5 rounded-xl shadow-sm border">
      <button
        onClick={generateReply}
        disabled={loadingReply}
        className="absolute top-4 right-4 btn btn-ghost btn-xs"
      >
        <RefreshIcon />
      </button>

      <p className="font-semibold mb-2 text-gray-800">{comment.author.name}</p>
      <p className="text-gray-600 mb-3">
        {parseCommentText(comment.text, onSeek)}
      </p>
      <p className="text-gray-400 text-sm mb-4">
        {new Date(comment.publishedAt).toLocaleDateString()}
      </p>

      <div className="mt-4 bg-gray-100 rounded-xl p-4">
        <p className="text-gray-500 text-sm mb-2 font-medium">
          Suggested reply:
        </p>

        {loadingReply ? (
          <div className="flex justify-center">
            <span className="loading loading-dots loading-sm"></span>
          </div>
        ) : suggestedReply ? (
          <>
            <p className="text-gray-700 mb-4">{suggestedReply}</p>
            <div className="flex justify-end">
              <button className="btn btn-primary btn-sm">Add reply</button>
            </div>
          </>
        ) : (
          <p className="text-gray-400 italic">
            Click the refresh button to generate a reply
          </p>
        )}
      </div>
    </div>
  );
}
