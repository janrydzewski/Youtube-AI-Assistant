import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { extractVideoIdFromUrl } from "@/app/utils/extractVideoIdFromUrl";

export function useChannelForm() {
  const [channelName, setChannelName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hasChannelName = !!channelName.trim();
    const hasVideoUrl = !!videoUrl.trim();

    if (!hasChannelName && !hasVideoUrl) {
      alert("Please enter a channel name or a video URL");
      return;
    }

    if (hasChannelName) {
      try {
        localStorage.setItem("selectedChannelId", channelName.trim());

        const res = await fetch("/api/youtube/set-channel-id", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ handle: channelName.trim() }),
        });

        if (!res.ok) throw new Error("Error setting channel");

        router.push("/dashboard/videos");
        return;
      } catch (error) {
        console.error("Error: ", error);
        return;
      }
    }

    if (hasVideoUrl) {
      localStorage.removeItem("selectedChannelId");

      const videoId = extractVideoIdFromUrl(videoUrl.trim());
      if (!videoId) {
        alert("Invalid YouTube video URL");
        return;
      }

      router.push(`/dashboard/videos/${videoId}`);
    }
  };

  return {
    channelName,
    setChannelName,
    videoUrl,
    setVideoUrl,
    handleSubmit,
  };
}
