import type { NextApiRequest, NextApiResponse } from "next";
import { OAuth2Client } from "google-auth-library";
import { AuthResponse } from "@shared/models/google";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) {
  throw new Error("Missing environment variable: GOOGLE_CLIENT_ID");
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  const { token } = req.body;
  if (!token || typeof token !== "string") {
    return res.status(400).json({ success: false, error: "Token is required" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid token payload" });
    }

    const { email, name, picture } = payload;
    return res.status(200).json({
      success: true,
      user: {
        email: email || "",
        name: name || "",
        picture: picture || "",
      },
    });
  } catch (error: unknown) {
    let errorMessage = "Authentication failed";
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Google auth error:", error);
    }
    return res.status(401).json({ success: false, error: errorMessage });
  }
}
