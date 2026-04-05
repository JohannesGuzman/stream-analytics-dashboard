import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:5500"],
  methods: ["GET"]
}));

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const TWITCH_LOGIN = "elmariana";

if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
  throw new Error("Missing Twitch environment variables");
}

app.get("/api/twitch-stats", async (req, res) => {
  try {
    const tokenRes = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        grant_type: "client_credentials"
      })
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      return res.status(500).json({
        error: "Failed to fetch Twitch stats"
      });
    }

    const accessToken = tokenData.access_token;

    const userRes = await fetch(`https://api.twitch.tv/helix/users?login=${TWITCH_LOGIN}`, {
      headers: {
        "Client-Id": TWITCH_CLIENT_ID,
        "Authorization": `Bearer ${accessToken}`
      }
    });

    const userData = await userRes.json();
    const user = userData.data?.[0];

    if (!userRes.ok || !user) {
      return res.status(404).json({
        error: "Twitch user not found"
      });
    }

    const followersRes = await fetch(
      `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${user.id}`,
      {
        headers: {
          "Client-Id": TWITCH_CLIENT_ID,
          "Authorization": `Bearer ${accessToken}`
        }
      }
    );

    const followersData = await followersRes.json();

    if (!followersRes.ok) {
      return res.status(500).json({
        error: "Failed to fetch Twitch stats"
      });
    }

    res.json({
      followers: followersData.total || 0,
      views: 0,
      displayName: user.display_name || user.login
    });
  } catch (error) {
    console.error("Twitch proxy error:", error);
    res.status(500).json({
      error: "Failed to fetch Twitch stats"
    });
  }
});

app.listen(3000, () => {
  console.log("Proxy running on http://localhost:3000");
});