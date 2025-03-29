import { NextResponse } from "next/server";
import { youtubeRequest } from "../youtubeRequest";
import type { VideosBody } from "@shared/models/models";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json(
      { error: "videoId parameter is required" },
      { status: 400 }
    );
  }

  try {
    const data = await youtubeRequest<any>({
      method: "GET",
      path: "/videos",
      params: {
        id: videoId,
        part: "snippet",
      },
    });

    const item = data.items?.[0];
    if (!item) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const thumb = {
      url: item.snippet.thumbnails?.high?.url || "",
      width: item.snippet.thumbnails?.high?.width || 0,
      height: item.snippet.thumbnails?.high?.height || 0,
    };

    const videoDetails: VideosBody = {
      videoId: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: thumb,
      publishedAt: new Date(item.snippet.publishedAt),
    };

    return NextResponse.json(videoDetails);
  } catch (error: unknown) {
    let errorMessage = "Error fetching video details";
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Error fetching video details:", error);
    }
    return NextResponse.json(
      { error: "Error fetching video details", details: errorMessage },
      { status: 500 }
    );
  }
}
