import axios, { AxiosError } from "axios";

export interface DeepseekRequestData {
  model: string;
  messages: { role: string; content: string }[];
  temperature: number;
  max_tokens: number;
  stop?: string[];
}

const API_KEY = process.env.OPENROUTER_API_KEY;
const API_URL = process.env.OPENROUTER_API_URL;

if (!API_KEY || !API_URL) {
  throw new Error("API key or URL not set");
}

const deepseekAxios = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  },
});

export async function sendDeepseekRequest(data: DeepseekRequestData) {
  try {
    const response = await deepseekAxios.post("", data);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = "An error occurred while sending request";
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data || error.message;
    }
    throw new Error(errorMessage);
  }
}
