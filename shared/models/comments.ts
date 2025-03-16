import { PageInfo } from "./page-info";

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
