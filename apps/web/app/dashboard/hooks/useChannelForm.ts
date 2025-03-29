import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function useChannelForm() {
  const [channelName, setChannelName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!channelName.trim() && !videoUrl.trim()) {
      alert("Please enter a channel name or a video URL");
      return;
    }

    if (channelName.trim()) {
      try {
        const res = await fetch("/api/youtube/set-channel-id", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ handle: channelName.trim() }),
        });
        if (!res.ok) throw new Error("Error setting channel");
        router.push("/dashboard/videos");
      } catch (error) {
        console.error("Error: ", error);
      }
    } else if (videoUrl.trim()) {
      router.push("/videos");
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
