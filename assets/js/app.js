async function loadDashboard() {
  try {
    setStatus("Loading data...", "loading");

    const metrics = await getDashboardData();

    renderCards(metrics);
    renderSummary(metrics);

    setStatus("Data loaded successfully.");
  } catch (error) {
    console.error(error);
    setStatus("Failed to load dashboard data.", "error");
  }
}

document.getElementById("refreshBtn").addEventListener("click", loadDashboard);

window.addEventListener("DOMContentLoaded", loadDashboard);