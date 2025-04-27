"use client";

import YouTube from "react-youtube";
import { useRef, forwardRef, useImperativeHandle } from "react";

interface YouTubePlayerProps {
  videoId: string;
}
export interface YouTubePlayerHandle {
  seekTo: (seconds: number) => void;
}

const YouTubePlayer = forwardRef<YouTubePlayerHandle, YouTubePlayerProps>(
  ({ videoId }, ref) => {
    const playerRef = useRef<any>(null);

    const onPlayerReady = (event: any) => {
      playerRef.current = event.target;
    };

    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number) => {
        if (playerRef.current) {
          playerRef.current.seekTo(seconds, true);
          playerRef.current.playVideo();
        }
      },
    }));

    return (
      <div className="w-full h-full relative">
        <YouTube
          videoId={videoId}
          className="absolute top-0 left-0 w-full h-full"
          iframeClassName="w-full h-full rounded-t-xl"
          opts={{
            width: "100%",
            height: "100%",
            playerVars: {
              autoplay: 0,
              modestbranding: 1,
              rel: 0,
            },
          }}
          onReady={onPlayerReady}
        />
      </div>
    );
  }
);

YouTubePlayer.displayName = "YouTubePlayer";

export default YouTubePlayer;
