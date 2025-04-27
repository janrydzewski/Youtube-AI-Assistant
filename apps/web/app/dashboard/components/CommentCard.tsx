import { colors } from "@/app/styles/theme";
import { CommentBody } from "@shared/models/youtube";

interface CommentCardProps {
  comment: CommentBody;
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <div
      className="bg-white p-5 rounded-xl shadow-sm border"
      style={{ borderColor: colors.border }}
    >
      <p className="font-semibold mb-2" style={{ color: colors.textPrimary }}>
        {comment.author.name}
      </p>
      <p className="mb-3" style={{ color: colors.textSecondary }}>
        {comment.text}
      </p>
      <p className="text-sm" style={{ color: colors.textSecondary }}>
        {new Date(comment.publishedAt).toLocaleDateString()}
      </p>
    </div>
  );
}
