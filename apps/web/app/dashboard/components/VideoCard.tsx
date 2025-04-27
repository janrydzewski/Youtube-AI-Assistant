import { colors } from "@/app/styles/theme";
import { VideosBody } from "@shared/models/models";
import Image from "next/image";

interface VideoCardProps {
  video: VideosBody;
}

export default function VideoCard({ video }: VideoCardProps) {
  const openVideoInNewTab = () => {
    window.open(`https://www.youtube.com/watch?v=${video.videoId}`, "_blank");
  };
  return (
    <div
      onClick={openVideoInNewTab}
      className="bg-white rounded-xl overflow-hidden shadow-md transition hover:scale-[1.02] duration-200 border w-full h-full"
      style={{ borderColor: colors.border }}
    >
      <div className="relative w-full aspect-video">
        <Image
          src={video.thumbnail.url}
          alt={video.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 h-[150px] flex flex-col justify-between">
        <div>
          <h2
            className="text-lg font-semibold mb-2 line-clamp-2"
            style={{ color: colors.textPrimary }}
          >
            {video.title}
          </h2>
          <p
            className="text-sm mb-2 line-clamp-2"
            style={{ color: colors.textSecondary }}
          >
            {video.description}
          </p>
        </div>
        <p className="text-xs" style={{ color: colors.textSecondary }}>
          {new Date(video.publishedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
