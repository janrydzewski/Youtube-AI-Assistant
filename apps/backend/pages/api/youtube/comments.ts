import type { NextApiRequest, NextApiResponse } from "next";
import { youtubeRequest } from "./youtubeRequest";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { videoId, pageToken } = req.query;
  if (!videoId || typeof videoId !== "string") {
    return res.status(400).json({ error: "videoId parameter is required" });
  }

  try {
    const data = await youtubeRequest<any>({
      method: "GET",
      path: "/commentThreads",
      params: {
        videoId,
        part: "snippet",
        maxResults: 10,
        ...(pageToken ? { pageToken } : {}),
      },
      envKeys: ["YOUTUBE_API_KEY"],
    });

    const { items, nextPageToken, prevPageToken, pageInfo } = data;
    return res
      .status(200)
      .json({ items, nextPageToken, prevPageToken, pageInfo });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "Error fetching comments", details: error.message });
  }
}
