"use client";

import { parseCommentText } from "@/app/utils/parseCommentText";
import { CommentBody } from "@shared/models/youtube";
import { useState } from "react";
import RefreshIcon from "@/app/components/icons/RefreshIcon";
import { useSession } from "next-auth/react";

interface CommentCardProps {
  comment: CommentBody;
  onSeek?: (seconds: number) => void;
  depth?: number;
}

export default function CommentCard({
  comment,
  onSeek,
  depth = 0,
}: CommentCardProps) {
  const [suggestedReply, setSuggestedReply] = useState<string | null>(null);
  const [loadingReply, setLoadingReply] = useState(false);
  const [addingReply, setAddingReply] = useState(false);
  const [addSuccess, setAddSuccess] = useState<boolean | null>(null);

  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const generateReply = async () => {
    setLoadingReply(true);
    setAddSuccess(null);
    try {
      const res = await fetch("/api/deepseek/generate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const submitReply = async () => {
    if (!suggestedReply) return;
    setAddingReply(true);
    setAddSuccess(null);
    try {
      const res = await fetch("/api/youtube/add-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ commentId: comment.id, text: suggestedReply }),
      });

      if (!res.ok) throw new Error("Failed to add reply");

      const { reply } = await res.json();
      comment.replies?.push({
        id: reply.id,
        text: reply.text,
        author: {
          name: reply.author,
          profileImageUrl: "",
          authorChannelUrl: "",
        },
        publishedAt: new Date(reply.publishedAt),
        updatedAt: new Date(reply.publishedAt),
        likeCount: 0,
        canReply: false,
        totalReplyCount: 0,
        isPublic: true,
        replies: [],
      });

      setAddSuccess(true);
    } catch (err) {
      console.error("Error adding reply:", err);
      setAddSuccess(false);
    } finally {
      setAddingReply(false);
    }
  };

  return (
    <div
      className={`relative bg-white p-5 rounded-xl shadow-sm border ${
        depth > 0 ? "ml-6 border-l-4 border-gray-200" : ""
      }`}
    >
      {depth === 0 && (
        <button
          onClick={generateReply}
          disabled={loadingReply}
          className="absolute top-4 right-4 btn btn-ghost btn-xs"
        >
          <RefreshIcon />
        </button>
      )}

      <p className="font-semibold mb-2 text-gray-800">{comment.author.name}</p>
      <p className="text-gray-600 mb-3">
        {parseCommentText(comment.text, onSeek)}
      </p>
      <p className="text-gray-400 text-sm mb-4">
        {new Date(comment.publishedAt).toLocaleDateString()}
      </p>

      {depth === 0 && (
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
              <div className="flex items-center justify-between">
                {addSuccess === true && (
                  <span className="text-green-600 text-sm">Reply added</span>
                )}
                {addSuccess === false && (
                  <span className="text-red-600 text-sm">Failed to add</span>
                )}
                <button
                  onClick={submitReply}
                  disabled={addingReply}
                  className="btn btn-primary btn-sm"
                >
                  {addingReply ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    "Add reply"
                  )}
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-400 italic">
              Click the refresh button to generate a reply
            </p>
          )}
        </div>
      )}

      {comment.replies && comment.replies?.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              onSeek={onSeek}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
