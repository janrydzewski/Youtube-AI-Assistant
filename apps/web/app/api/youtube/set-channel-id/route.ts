import { NextResponse } from "next/server";
import { youtubeRequest } from "../youtubeRequest";

export async function POST(request: Request) {
  try {
    const { handle } = (await request.json()) as { handle?: string };

    if (!handle || typeof handle !== "string" || handle.trim() === "") {
      return NextResponse.json(
        { error: "Handle (e.g. @ExampleChannel) is required" },
        { status: 400 }
      );
    }

    const data = await youtubeRequest<any>({
      method: "GET",
      path: "/search",
      params: {
        part: "snippet",
        type: "channel",
        q: handle.trim(),
        maxResults: 1,
      },
    });

    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: "No channel found for the given handle" },
        { status: 404 }
      );
    }

    const channelId = data.items[0]?.id?.channelId;
    if (!channelId) {
      return NextResponse.json(
        { error: "Unable to retrieve channelId" },
        { status: 404 }
      );
    }

    process.env.YOUTUBE_CHANNEL_ID = channelId;

    return NextResponse.json({
      message: "YouTube channel ID updated",
      handle: handle.trim(),
      channelId,
    });
  } catch (error: unknown) {
    let errorMessage = "Error setting channel ID from handle";
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Error setting channel ID from handle:", error);
    }
    return NextResponse.json(
      { error: "Error setting channel ID from handle", details: errorMessage },
      { status: 500 }
    );
  }
}
