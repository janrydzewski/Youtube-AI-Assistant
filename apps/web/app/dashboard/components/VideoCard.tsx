import { VideosBody } from "@shared/models/models";
import Image from "next/image";

interface VideoCardProps {
  video: VideosBody;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <div className="bg-gray-800 bg-opacity-90 backdrop-blur rounded-xl overflow-hidden shadow-xl transition hover:scale-[1.02] duration-200 border border-white border-opacity-10 w-full h-full">
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
          <h2 className="text-lg font-semibold text-white mb-1 line-clamp-2">
            {video.title}
          </h2>
          <p className="text-gray-300 text-sm mb-2 line-clamp-2">
            {video.description}
          </p>
        </div>
        <p className="text-gray-400 text-xs">
          {new Date(video.publishedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
