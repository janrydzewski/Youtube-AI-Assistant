import axios from "axios";

export interface DeepseekRequestData {
  model: string;
  messages: { role: string; content: string }[];
  temperature: number;
  max_tokens: number;
  stop?: string[];
}

export async function sendDeepseekRequest(data: DeepseekRequestData) {
  const API_KEY = process.env.OPENROUTER_API_KEY;
  const API_URL = process.env.OPENROUTER_API_URL;
  if (!API_KEY || !API_URL) {
    throw new Error("API key or URL not set");
  }
  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };
  const response = await axios.post(API_URL, data, { headers });
  return response.data;
}
