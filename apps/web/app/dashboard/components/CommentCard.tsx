import { parseCommentText } from "@/app/utils/parseCommentText";
import { CommentBody } from "@shared/models/youtube";

interface CommentCardProps {
  comment: CommentBody;
  onSeek?: (seconds: number) => void;
}

export default function CommentCard({ comment, onSeek }: CommentCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <p className="font-semibold mb-2 text-gray-800">{comment.author.name}</p>
      <p className="text-gray-600 mb-3">
        {parseCommentText(comment.text, onSeek)}
      </p>
      <p className="text-gray-400 text-sm">
        {new Date(comment.publishedAt).toLocaleDateString()}
      </p>
    </div>
  );
}
