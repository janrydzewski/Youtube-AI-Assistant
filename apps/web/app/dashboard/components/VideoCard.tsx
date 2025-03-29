import { VideosBody } from "@shared/models/models";
import Image from "next/image";

interface VideoCardProps {
  video: VideosBody;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <div className="card bg-white shadow-md rounded-xl overflow-hidden">
      <Image
        src={video.thumbnail.url}
        alt={video.title}
        width={video.thumbnail.width}
        height={video.thumbnail.height}
        className="w-full object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 text-black">{video.title}</h2>
        <p className="text-gray-600 mb-2 line-clamp-2">{video.description}</p>
        <p className="text-gray-500 text-sm">
          {new Date(video.publishedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
