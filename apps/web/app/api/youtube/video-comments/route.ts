/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import type { CommentResponse } from "@shared/models/models";
import { fetchComments } from "../commentsHelpers";

function extractVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.slice(1);
    }
    if (parsedUrl.hostname.includes("youtube.com")) {
      return parsedUrl.searchParams.get("v");
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { url } = (await request.json()) as { url?: string };

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Video URL is required" },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube video URL" },
        { status: 400 }
      );
    }

    const comments: CommentResponse = await fetchComments(videoId);
    return NextResponse.json(comments);
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
