import { CommentBody } from "@shared/models/youtube";

interface CommentCardProps {
  comment: CommentBody;
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <div className="bg-gray-800 bg-opacity-90 backdrop-blur p-5 rounded-xl shadow border border-white border-opacity-10">
      <p className="font-semibold text-white mb-1">{comment.author.name}</p>
      <p className="text-gray-300 mb-2">{comment.text}</p>
      <p className="text-gray-400 text-sm">
        {new Date(comment.publishedAt).toLocaleDateString()}
      </p>
    </div>
  );
}
