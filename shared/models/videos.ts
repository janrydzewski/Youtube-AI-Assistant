import { PageInfo } from "./page-info";

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
