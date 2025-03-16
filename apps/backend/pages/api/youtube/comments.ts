import type { NextApiRequest, NextApiResponse } from "next";
import { youtubeRequest } from "./youtubeRequest";
import type {
  CommentResponse,
  CommentBody,
  Author,
  PageInfo,
} from "@shared/models/models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommentResponse | { error: string; details?: any }>
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

    const mappedItems: CommentBody[] = items.map((item: any) => {
      const snippet = item.snippet;
      const topLevelSnippet = snippet.topLevelComment.snippet;

      const author: Author = {
        name: topLevelSnippet.authorDisplayName,
        profileImageUrl: topLevelSnippet.authorProfileImageUrl,
        authorChannelUrl: topLevelSnippet.authorChannelUrl,
      };

      return {
        id: item.id,
        text: topLevelSnippet.textDisplay,
        author,
        likeCount: topLevelSnippet.likeCount,
        publishedAt: new Date(topLevelSnippet.publishedAt),
        updatedAt: new Date(topLevelSnippet.updatedAt),
        canReply: snippet.canReply,
        totalReplyCount: snippet.totalReplyCount,
        isPublic: snippet.isPublic,
      };
    });

    const channelId = items[0]?.snippet.channelId ?? "UnknownChannel";

    const responsePageInfo: PageInfo = {
      totalResults: pageInfo?.totalResults ?? 0,
      resultsPerPage: pageInfo?.resultsPerPage ?? 10,
      nextPageToken,
      prevPageToken,
    };

    const responseBody: CommentResponse = {
      channelId,
      items: mappedItems,
      pageInfo: responsePageInfo,
    };

    return res.status(200).json(responseBody);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "Error fetching comments", details: error.message });
  }
}
