import type { NextApiRequest, NextApiResponse } from "next";
import { sendDeepseekRequest } from "@/pages/api/deepseek/deepseekRequest";
import type {
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
    const data = {
      model: "deepseek/deepseek-chat:free",
      messages: [
        {
          role: "system",
          content: `Generate a reply to the following comment with a ${
            tone || "neutral"
          } tone. Provide a single, complete sentence.`,
        },
        { role: "user", content: comment },
      ],
      temperature: 0.7,
      max_tokens: 30,
    };
    const response = await sendDeepseekRequest(data);
    const aiResponse = response.choices[0].message.content;
    const result: GenerateResponseResponse = { reply: aiResponse };
    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "Error processing request", details: error.message });
  }
}
