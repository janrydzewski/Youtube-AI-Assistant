import {
  Thumbnail,
  VideosBody,
  VideosResponse,
  PageInfo,
} from "@shared/models/models";
import type { NextApiRequest, NextApiResponse } from "next";
import { youtubeRequest } from "./youtubeRequest";

const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
if (!YOUTUBE_CHANNEL_ID) {
  throw new Error("Missing environment variable: YOUTUBE_CHANNEL_ID");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VideosResponse | { error: string; details?: any }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const pageToken =
    typeof req.query.pageToken === "string" ? req.query.pageToken : "";

  try {
    const data = await youtubeRequest<any>({
      method: "GET",
      path: "/search",
      params: {
        channelId: YOUTUBE_CHANNEL_ID,
        part: "snippet,id",
        order: "date",
        maxResults: 10,
        ...(pageToken && { pageToken }),
      },
    });

    const filteredItems = data.items.filter(
      (item: any) => item.id && item.id.kind === "youtube#video"
    );

    const mappedItems: VideosBody[] = filteredItems.map((item: any) => {
      const thumb: Thumbnail = {
        url: item.snippet.thumbnails?.default?.url || "",
        width: item.snippet.thumbnails?.default?.width || 0,
        height: item.snippet.thumbnails?.default?.height || 0,
      };

      return {
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: thumb,
        publishedAt: new Date(item.snippet.publishedAt),
      };
    });

    const pageInfo: PageInfo = {
      totalResults: data.pageInfo.totalResults,
      resultsPerPage: data.pageInfo.resultsPerPage,
      nextPageToken: data.nextPageToken,
      prevPageToken: data.prevPageToken,
    };

    const channelName = filteredItems[0]?.snippet?.channelTitle || "Unknown";
    const channelId =
      filteredItems[0]?.snippet?.channelId || YOUTUBE_CHANNEL_ID;

    const responseBody: VideosResponse = {
      channelName,
      channelId,
      items: mappedItems,
      pageInfo,
    };

    return res.status(200).json(responseBody);
  } catch (error: unknown) {
    let errorMessage = "Error fetching videos";
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Error fetching videos:", error);
    }
    return res
      .status(500)
      .json({ error: "Error fetching videos", details: errorMessage });
  }
}
