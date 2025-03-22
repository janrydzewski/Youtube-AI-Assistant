import axios, { AxiosRequestConfig, Method } from "axios";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = process.env.YOUTUBE_API_URL;

if (!YOUTUBE_API_KEY || !YOUTUBE_API_URL) {
  throw new Error("Missing required YouTube API environment variables");
}

const youtubeAxios = axios.create({
  baseURL: YOUTUBE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function youtubeRequest<T>(config: {
  method: Method;
  path: string;
  params?: Record<string, any>;
  data?: any;
}): Promise<T> {
  const url = config.path;

  const defaultParams = { key: YOUTUBE_API_KEY };
  const finalParams = { ...defaultParams, ...config.params };

  const axiosConfig: AxiosRequestConfig = {
    method: config.method,
    url,
    params: finalParams,
    data: config.data,
  };

  try {
    const response = await youtubeAxios.request<T>(axiosConfig);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `YouTube API request failed: ${
          error.response?.status
        } - ${JSON.stringify(error.response?.data)}`
      );
    }
    throw error;
  }
}
