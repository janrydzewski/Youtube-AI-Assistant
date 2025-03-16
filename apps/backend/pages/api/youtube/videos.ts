import type { NextApiRequest, NextApiResponse } from "next";
import { youtubeRequest } from "./youtubeRequest";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const pageToken = req.query.pageToken;
  if (!process.env.YOUTUBE_CHANNEL_ID) {
    throw new Error("Missing environment variable: YOUTUBE_CHANNEL_ID");
  }

  try {
    const data = await youtubeRequest<any>({
      method: "GET",
      path: "/search",
      params: {
        channelId: process.env.YOUTUBE_CHANNEL_ID,
        part: "snippet,id",
        order: "date",
        maxResults: 10,
        ...(pageToken ? { pageToken } : {}),
      },
      envKeys: ["YOUTUBE_API_KEY", "YOUTUBE_CHANNEL_ID"],
    });

    const filteredItems = data.items.filter(
      (item: any) => item.id && item.id.kind === "youtube#video"
    );
    const { nextPageToken, prevPageToken, pageInfo } = data;
    return res.status(200).json({
      items: filteredItems,
      nextPageToken,
      prevPageToken,
      pageInfo,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "Error fetching videos", details: error.message });
  }
}
