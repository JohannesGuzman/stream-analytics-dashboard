async function fetchYouTubeStats() {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CONFIG.youtubeChannelId}&key=${CONFIG.youtubeApiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status}`);
  }

  const data = await response.json();
  const channel = data.items?.[0];

  if (!channel) {
    throw new Error("YouTube channel not found.");
  }

  return {
    subscribers: Number(channel.statistics.subscriberCount || 0),
    views: Number(channel.statistics.viewCount || 0),
    videos: Number(channel.statistics.videoCount || 0)
  };
}

async function fetchTwitchStats() {
  const response = await fetch(CONFIG.twitchProxyUrl);

  if (!response.ok) {
    throw new Error(`Twitch proxy error: ${response.status}`);
  }

  const data = await response.json();

  return {
    followers: Number(data.followers || 0),
    views: Number(data.views || 0),
    displayName: data.displayName || "Twitch Channel"
  };
}

async function fetchMockData() {
  const response = await fetch("data/mock.json");

  if (!response.ok) {
    throw new Error("Mock data not available.");
  }

  return response.json();
}

async function getDashboardData() {
  const [youtube, twitch] = await Promise.all([
    fetchYouTubeStats(),
    fetchTwitchStats()
  ]);

  return { youtube, twitch };
}