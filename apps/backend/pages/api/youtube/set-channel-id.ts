import type { NextApiRequest, NextApiResponse } from "next";
import { youtubeRequest } from "./youtubeRequest";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { handle } = req.body as { handle?: string };
  if (!handle) {
    return res
      .status(400)
      .json({ error: "Handle (e.g. @ExampleChannel) is required" });
  }

  try {
    const data = await youtubeRequest<any>({
      method: "GET",
      path: "/search",
      params: {
        part: "snippet",
        type: "channel",
        q: handle,
        maxResults: 1,
      },
      envKeys: ["YOUTUBE_API_KEY"],
    });

    if (!data.items || data.items.length === 0) {
      return res
        .status(404)
        .json({ error: "No channel found for the given handle" });
    }

    const channelId = data.items[0]?.id?.channelId;
    if (!channelId) {
      return res.status(404).json({ error: "Unable to retrieve channelId" });
    }

    process.env.YOUTUBE_CHANNEL_ID = channelId;

    return res.status(200).json({
      message: "YouTube channel ID updated",
      handle,
      channelId,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: "Error setting channel ID from handle",
      details: error.message,
    });
  }
}
