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
      part: "snippet,replies",
      ...(pageToken && { pageToken }),
    },
  });

  const { items, nextPageToken, prevPageToken, pageInfo: apiPageInfo } = data;

  const mappedItems: CommentBody[] = items.map((item: any) => {
    const snippet = item.snippet;
    const topLevel = snippet.topLevelComment.snippet;

    const author: Author = {
      name: topLevel.authorDisplayName,
      profileImageUrl: topLevel.authorProfileImageUrl,
      authorChannelUrl: topLevel.authorChannelUrl,
    };

    const topLevelComment: CommentBody = {
      id: item.snippet.topLevelComment.id,
      text: topLevel.textDisplay,
      author,
      likeCount: topLevel.likeCount,
      publishedAt: new Date(topLevel.publishedAt),
      updatedAt: new Date(topLevel.updatedAt),
      canReply: snippet.canReply,
      totalReplyCount: snippet.totalReplyCount,
      isPublic: snippet.isPublic,
      replies:
        item.replies?.comments?.map((reply: any) => {
          const replySnippet = reply.snippet;
          return {
            id: reply.id,
            text: replySnippet.textDisplay,
            author: {
              name: replySnippet.authorDisplayName,
              profileImageUrl: replySnippet.authorProfileImageUrl,
              authorChannelUrl: replySnippet.authorChannelUrl,
            },
            likeCount: replySnippet.likeCount,
            publishedAt: new Date(replySnippet.publishedAt),
            updatedAt: new Date(replySnippet.updatedAt),
            canReply: false,
            totalReplyCount: 0,
            isPublic: true,
          };
        }) ?? [],
    };

    return topLevelComment;
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
