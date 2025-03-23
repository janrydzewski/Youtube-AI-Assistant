import { NextResponse } from "next/server";
import type { AddReplyRequest, AddReplyResponse } from "@shared/models/youtube";
import { youtubeRequest } from "../youtubeRequest";

export async function POST(request: Request) {
  try {
    const { commentId, text } = (await request.json()) as AddReplyRequest;

    if (!commentId || typeof commentId !== "string") {
      return NextResponse.json(
        { error: "commentId is required and must be a string" },
        { status: 400 }
      );
    }
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "text is required and must be a string" },
        { status: 400 }
      );
    }

    const data = await youtubeRequest<any>({
      method: "POST",
      path: "/comments",
      params: {
        part: "snippet",
      },
      data: {
        snippet: {
          parentId: commentId,
          textOriginal: text,
        },
      },
    });

    const createdReply = data?.items?.[0];
    if (!createdReply) {
      return NextResponse.json(
        {
          error: "Failed to create reply",
          details: "No reply returned from YouTube API",
        },
        { status: 500 }
      );
    }

    const snippet = createdReply.snippet;
    const replyBody: AddReplyResponse = {
      reply: {
        id: createdReply.id,
        text: snippet.textDisplay,
        author: snippet.authorDisplayName,
        publishedAt: new Date(snippet.publishedAt),
      },
    };

    return NextResponse.json(replyBody);
  } catch (error: unknown) {
    let errorMessage = "Error creating reply";
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Error creating reply:", error);
    }
    return NextResponse.json(
      { error: "Error creating reply", details: errorMessage },
      { status: 500 }
    );
  }
}
