import axios, { AxiosRequestConfig, Method } from "axios";

export async function youtubeRequest<T>(config: {
  method: Method;
  path: string;
  params?: Record<string, any>;
  data?: any;
  envKeys?: string[];
}): Promise<T> {
  const requiredEnvKeys = config.envKeys || ["YOUTUBE_API_KEY"];
  for (const key of requiredEnvKeys) {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }

  const API_KEY = process.env.YOUTUBE_API_KEY;
  const baseUrl = process.env.YOUTUBE_API_URL;
  const url = `${baseUrl}${config.path}`;

  const defaultParams = { key: API_KEY };
  const finalParams = { ...defaultParams, ...config.params };

  const headers = {
    "Content-Type": "application/json",
  };

  const axiosConfig: AxiosRequestConfig = {
    method: config.method,
    url,
    headers,
    params: finalParams,
    data: config.data,
  };

  const response = await axios.request<T>(axiosConfig);
  return response.data;
}

