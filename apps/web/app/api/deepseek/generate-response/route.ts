import { NextResponse } from "next/server";
import { sendDeepseekRequest } from "@/app/api/deepseek/deepseekRequest";
import type { GenerateResponseResponse } from "@shared/models/models";

const MODEL = "deepseek/deepseek-chat:free";
const TEMPERATURE = 0.7;
const MAX_TOKENS = 30;

function getSystemPrompt(tone: string): string {
  return `Imagine you're a YouTuber who just posted a video. Generate a reply to the following comment in a ${tone} tone, using a single, complete sentence.`;
}

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
    const tone: string = body.tone?.trim() || "neutral";

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
      return NextResponse.json(
        { error: "Invalid response from sentiment analysis service" },
        { status: 500 }
      );
    }

    const aiResponse = response.choices[0].message.content.trim();
    const result: GenerateResponseResponse = { reply: aiResponse };

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
