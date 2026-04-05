function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value ?? 0);
}

function setStatus(message, type = "default") {
  const statusText = document.getElementById("statusText");
  statusText.textContent = message;
  statusText.className = "";
  if (type === "error") statusText.classList.add("error");
  if (type === "loading") statusText.classList.add("loading");
}

function createMetricCard({ label, value, platform }) {
  const isNumber = typeof value === "number";

  return `
    <article class="metric-card">
      <div class="label">${label}</div>
      <div class="value">${isNumber ? formatNumber(value) : value}</div>
      <div class="platform">${platform}</div>
    </article>
  `;
}

function renderCards(metrics) {
  const cardsGrid = document.getElementById("cardsGrid");

const cards = [
  { label: "YouTube Subscribers", value: metrics.youtube.subscribers, platform: "YouTube" },
  { label: "YouTube Total Views", value: metrics.youtube.views, platform: "YouTube" },
  { label: "YouTube Videos", value: metrics.youtube.videos, platform: "YouTube" },
  { label: "Twitch Followers", value: metrics.twitch.followers, platform: "Twitch" },
  { label: "Twitch Channel", value: metrics.twitch.displayName, platform: "Twitch" }
];

  cardsGrid.innerHTML = cards.map(createMetricCard).join("");
}

function renderSummary(metrics) {
  const summaryTable = document.getElementById("summaryTable");

  summaryTable.innerHTML = `
    <div class="summary-row header">
      <div>Platform</div>
      <div>Main Metric</div>
      <div>Secondary Metric</div>
      <div>Extra</div>
    </div>

    <div class="summary-row">
      <div>YouTube</div>
      <div>${formatNumber(metrics.youtube.subscribers)} subscribers</div>
      <div>${formatNumber(metrics.youtube.views)} views</div>
      <div>${formatNumber(metrics.youtube.videos)} videos</div>
    </div>

    <div class="summary-row">
      <div>Twitch</div>
      <div>${formatNumber(metrics.twitch.followers)} followers</div>
      <div>${formatNumber(metrics.twitch.views)} views</div>
      <div>${metrics.twitch.displayName || "Channel"}</div>
    </div>
  `;
}