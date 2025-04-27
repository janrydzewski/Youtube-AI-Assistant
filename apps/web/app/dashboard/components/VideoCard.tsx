import { colors } from "@/app/styles/theme";
import { VideosBody } from "@shared/models/models";
import Image from "next/image";
import { forwardRef } from "react";
import YouTubePlayer, { YouTubePlayerHandle } from "./YoutubePlayer";

interface VideoCardProps {
  video: VideosBody;
  withPlayer?: boolean;
}

const VideoCard = forwardRef<YouTubePlayerHandle, VideoCardProps>(
  ({ video, withPlayer = false }, ref) => {
    return (
      <div
        className="bg-white rounded-xl overflow-hidden shadow-md transition hover:scale-[1.02] duration-200 border w-full cursor-pointer flex flex-col"
        style={{ borderColor: colors.border }}
      >
        <div className="w-full aspect-video relative">
          {withPlayer ? (
            <div className="absolute inset-0">
              <YouTubePlayer ref={ref} videoId={video.videoId} />
            </div>
          ) : (
            <Image
              src={video.thumbnail.url}
              alt={video.title}
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="p-4 flex flex-col gap-2 flex-grow">
          <h2
            className="text-lg font-semibold line-clamp-2"
            style={{ color: colors.textPrimary }}
          >
            {video.title}
          </h2>
          <p
            className="text-sm line-clamp-2"
            style={{ color: colors.textSecondary }}
          >
            {video.description}
          </p>
          <p
            className="text-xs mt-auto"
            style={{ color: colors.textSecondary }}
          >
            {new Date(video.publishedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  }
);

VideoCard.displayName = "VideoCard";

export default VideoCard;
