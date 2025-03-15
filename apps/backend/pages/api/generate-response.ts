import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import {
  GenerateResponseRequest,
  GenerateResponseResponse,
} from "@/models/generate-response";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });
  const { comment, tone } = req.body as GenerateResponseRequest;
  if (!comment) return res.status(400).json({ error: "Comment is required" });

  try {
    const API_KEY = process.env.OPENROUTER_API_KEY;
    const API_URL = process.env.OPENROUTER_API_URL;
    if (!API_KEY || !API_URL) {
      return res.status(500).json({ error: "API key or URL not set" });
    }
    const data = {
      model: "deepseek/deepseek-chat:free",
      messages: [
        {
          role: "system",
          content: `Generate a reply to the following comment with a ${
            tone || "neutral"
          } tone:`,
        },
        { role: "user", content: comment },
      ],
      temperature: 0.7,
      max_tokens: 150,
    };
    const headers = {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(API_URL, data, { headers });
    const aiResponse = response.data.choices[0].message.content;
    const result: GenerateResponseResponse = { reply: aiResponse };
    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "Error processing request", details: error.message });
  }
}
