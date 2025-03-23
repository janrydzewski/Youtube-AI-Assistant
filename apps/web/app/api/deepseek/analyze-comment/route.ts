import { NextResponse } from "next/server";
import { sendDeepseekRequest } from "@/app/api/deepseek/deepseekRequest";
import { AnalyzeCommentResponse, Sentiment } from "@shared/models/models";

const MODEL = "deepseek/deepseek-chat:free";
const TEMPERATURE = 0.0;
const MAX_TOKENS = 10;
const SYSTEM_PROMPT =
  "Analyze the sentiment of the following comment. Respond with only one word: positive, negative, or neutral.";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body ||
      typeof body.comment !== "string" ||
      body.comment.trim() === ""
    ) {
      return NextResponse.json(
        { error: "Comment is required" },
        { status: 400 }
      );
    }

    const comment: string = body.comment.trim();

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
      return NextResponse.json(
        { error: "Invalid response from sentiment analysis service" },
        { status: 500 }
      );
    }

    const sentimentStr = response.choices[0].message.content
      .trim()
      .toLowerCase();

    let enumSentiment: Sentiment;
    if (sentimentStr === "positive") {
      enumSentiment = Sentiment.Positive;
    } else if (sentimentStr === "negative") {
      enumSentiment = Sentiment.Negative;
    } else {
      enumSentiment = Sentiment.Neutral;
    }

    const result: AnalyzeCommentResponse = { sentiment: enumSentiment };
    return NextResponse.json(result);
  } catch (error: unknown) {
    let errorMessage = "Error processing request";
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Error processing request:", error);
    }
    return NextResponse.json(
      { error: "Error processing request", details: errorMessage },
      { status: 500 }
    );
  }
}
