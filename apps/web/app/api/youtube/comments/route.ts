import { NextResponse } from "next/server";
import type { CommentResponse } from "@shared/models/models";
import { fetchComments } from "../commentsHelpers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");
  const pageToken = searchParams.get("pageToken") || "";

  if (!videoId) {
    return NextResponse.json(
      { error: "videoId parameter is required" },
      { status: 400 }
    );
  }

  try {
    const responseBody: CommentResponse = await fetchComments(
      videoId,
      pageToken
    );
    return NextResponse.json(responseBody);
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
