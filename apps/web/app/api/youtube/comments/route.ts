import { NextResponse } from "next/server";
import { fetchComments } from "../commentsHelpers";
import { youtubeRequest } from "../youtubeRequest";

const commentCountCache = new Map<string, number>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");
  let pageToken = searchParams.get("pageToken") || undefined;
  if (!pageToken || pageToken === "null" || pageToken === "undefined") {
    pageToken = undefined;
  }

  if (!videoId) {
    return NextResponse.json(
      { error: "videoId parameter is required" },
      { status: 400 }
    );
  }

  try {
    let realTotalResults = commentCountCache.get(videoId) || null;

    if (!realTotalResults && !pageToken) {
      const statsData = await youtubeRequest<any>({
        method: "GET",
        path: "/videos",
        params: {
          part: "statistics",
          id: videoId,
        },
      });
      realTotalResults = parseInt(
        statsData.items?.[0]?.statistics?.commentCount || "0",
        10
      );
      commentCountCache.set(videoId, realTotalResults);
    }

    const responseBody = await fetchComments(videoId, pageToken);

    return NextResponse.json({
      ...responseBody,
      realTotalResults,
    });
  } catch (error: unknown) {
    let errorMessage = "Error fetching comments";
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Error fetching comments:", error);
    }
    return NextResponse.json(
      { error: "Error fetching comments", details: errorMessage },
      { status: 500 }
    );
  }
}
