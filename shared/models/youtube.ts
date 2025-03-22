export interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
  nextPageToken?: string;
  prevPageToken?: string;
}

export interface VideosBody {
  videoId: string;
  title: string;
  description: string;
  thumbnail: Thumbnail;
  publishedAt: Date;
}
export interface VideosResponse {
  channelName: string;
  channelId: string;
  items: VideosBody[];
  pageInfo: PageInfo;
}

export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface CommentBody {
  id: string;
  text: string;
  author: Author;
  likeCount: number;
  publishedAt: Date;
  updatedAt: Date;
  canReply: boolean;
  totalReplyCount: number;
  isPublic: boolean;
}
export interface CommentResponse {
  channelId: string;
  items: CommentBody[];
  pageInfo: PageInfo;
}
export interface Author {
  name: string;
  profileImageUrl: string;
  authorChannelUrl: string;
}

export interface AddReplyRequest {
  commentId: string;
  text: string;
}

export interface AddReplyResponse {
  reply: {
    id: string;
    text: string;
    author: string;
    publishedAt: Date;
  };
}
