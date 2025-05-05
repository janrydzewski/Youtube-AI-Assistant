import { youtubeRequest } from "./youtubeRequest";
import type {
  CommentResponse,
  CommentBody,
  Author,
  PageInfo,
} from "@shared/models/models";

export async function fetchComments(
  videoId: string,
  pageToken = ""
): Promise<Omit<CommentResponse, "realTotalResults">> {
  const data = await youtubeRequest<any>({
    method: "GET",
    path: "/commentThreads",
    params: {
      videoId,
      part: "snippet",
      maxResults: 10,
      ...(pageToken && { pageToken }),
    },
  });

  const { items, nextPageToken, prevPageToken, pageInfo: apiPageInfo } = data;

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

  const channelId = items[0]?.snippet?.channelId ?? "UnknownChannel";

  const responsePageInfo: PageInfo = {
    totalResults: apiPageInfo?.totalResults ?? 0,
    resultsPerPage: apiPageInfo?.resultsPerPage ?? 10,
    nextPageToken,
    prevPageToken,
  };

  return {
    channelId,
    items: mappedItems,
    pageInfo: responsePageInfo,
  };
}
