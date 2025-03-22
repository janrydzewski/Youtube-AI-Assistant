import type { NextApiRequest, NextApiResponse } from "next";
import { sendDeepseekRequest } from "@/pages/api/deepseek/deepseekRequest";
import { AnalyzeCommentResponse, Sentiment } from "@shared/models/models";

const MODEL = "deepseek/deepseek-chat:free";
const TEMPERATURE = 0.0;
const MAX_TOKENS = 10;
const SYSTEM_PROMPT =
  "Analyze the sentiment of the following comment. Respond with only one word: positive, negative, or neutral.";

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

  try {
    const requestPayload = {
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: comment },
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
      !response.choices[0]?.message?.content
    ) {
      return res
        .status(500)
        .json({ error: "Invalid response from sentiment analysis service" });
    }

    const sentimentStr = response.choices[0].message.content
      .trim()
      .toLowerCase();

    let enumSentiment: Sentiment;
    if (sentimentStr === Sentiment.Positive) {
      enumSentiment = Sentiment.Positive;
    } else if (sentimentStr === Sentiment.Negative) {
      enumSentiment = Sentiment.Negative;
    } else {
      enumSentiment = Sentiment.Neutral;
    }

    const result: AnalyzeCommentResponse = { sentiment: enumSentiment };
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
