import type { NextApiRequest, NextApiResponse } from "next";
import { sendDeepseekRequest } from "@/pages/api/deepseek/deepseekRequest";
import type { GenerateResponseResponse } from "@shared/models/models";

const MODEL = "deepseek/deepseek-chat:free";
const TEMPERATURE = 0.7;
const MAX_TOKENS = 30;

function getSystemPrompt(tone: string): string {
  return `Imagine you're a YouTuber who just posted a video. Generate a reply to the following comment in a ${tone} tone, using a single, complete sentence.`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (
    !req.body ||
    typeof req.body.comment !== "string" ||
    req.body.comment.trim() === ""
  ) {
    return res.status(400).json({ error: "Comment is required" });
  }

  const comment: string = req.body.comment.trim();
  const tone: string = req.body.tone?.trim() || "neutral";

  try {
    const requestPayload = {
      model: MODEL,
      messages: [
        {
          role: "system",
          content: getSystemPrompt(tone),
        },
        {
          role: "user",
          content: comment,
        },
      ],
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
    };

    const response = await sendDeepseekRequest(requestPayload);

    if (
      !response ||
      !response.choices ||
      !Array.isArray(response.choices) ||
      response.choices.length === 0 ||
      !response.choices[0].message ||
      !response.choices[0].message.content
    ) {
      return res.status(500).json({
        error: "Invalid response from sentiment analysis service",
      });
    }

    const aiResponse = response.choices[0].message.content.trim();
    const result: GenerateResponseResponse = { reply: aiResponse };
    return res.status(200).json(result);
  } catch (error: unknown) {
    let errorMessage = "Error processing request";
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Error processing request:", error);
    }
    return res
      .status(500)
      .json({ error: "Error processing request", details: errorMessage });
  }
}
