import { NextApiRequest, NextApiResponse } from "next";
import { OAuth2Client } from "google-auth-library";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;

if (!clientId || !clientSecret || !redirectUri) {
  throw new Error("Missing required Google OAuth environment variables");
}

const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { code } = req.query;
  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Missing code parameter" });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    return res.status(200).json({
      message: "OAuth2 callback success",
      tokens,
    });
  } catch (error: unknown) {
    console.error("OAuth2 callback error:", error);
    return res
      .status(500)
      .json({ error: "Failed to exchange code for tokens" });
  }
}
