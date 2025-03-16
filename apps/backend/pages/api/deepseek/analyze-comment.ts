import type { NextApiRequest, NextApiResponse } from "next";
import { sendDeepseekRequest } from "@/pages/api/deepseek/deepseekRequest";
import {
  AnalyzeCommentRequest,
  AnalyzeCommentResponse,
  Sentiment,
} from "@/models/analyze-comment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  const { comment } = req.body as AnalyzeCommentRequest;
  if (!comment) return res.status(400).json({ error: "Comment is required" });

  try {
    const data = {
      model: "deepseek/deepseek-chat:free",
      messages: [
        {
          role: "system",
          content:
            "Analyze the sentiment of the following comment. Respond with only one word: positive, negative, or neutral.",
        },
        { role: "user", content: comment },
      ],
      temperature: 0.0,
      max_tokens: 10,
    };
    const response = await sendDeepseekRequest(data);
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
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "Error processing request", details: error.message });
  }
}
