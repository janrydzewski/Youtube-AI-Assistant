import type { NextApiRequest, NextApiResponse } from "next";
import { youtubeRequest } from "./youtubeRequest";
import type { AddReplyRequest, AddReplyResponse } from "@shared/models/youtube";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AddReplyResponse | { error: string; details?: any }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { commentId, text } = req.body as AddReplyRequest;
  if (!commentId || typeof commentId !== "string") {
    return res
      .status(400)
      .json({ error: "commentId is required and must be a string" });
  }
  if (!text || typeof text !== "string") {
    return res
      .status(400)
      .json({ error: "text is required and must be a string" });
  }

  try {
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
      return res.status(500).json({
        error: "Failed to create reply",
        details: "No reply returned from YouTube API",
      });
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

    return res.status(200).json(replyBody);
  } catch (error: unknown) {
    let errorMessage = "Error creating reply";
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Error creating reply:", error);
    }
    return res
      .status(500)
      .json({ error: "Error creating reply", details: errorMessage });
  }
}
