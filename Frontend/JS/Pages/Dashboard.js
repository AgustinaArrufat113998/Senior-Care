import { getCarers } from "../Api/Carer.js";
import { getAllUsers, getAllStreets } from "../Api/userApi.js";

const totalUsersEl = document.getElementById("totalUsers");
const usersCountEl = document.getElementById("usersCount");
const carersCountEl = document.getElementById("carersCount");
const activeVsInactiveEl = document.getElementById("activeVsInactive");
const refreshBtn = document.getElementById("refreshDashboard");

let charts = {};

document.addEventListener("DOMContentLoaded", async () => {
  const role = (localStorage.getItem("userRole") || "").toUpperCase();
  if (role !== "ADMIN") {
    window.location.href = "Home.html";
    return;
  }

  await loadDashboard();
  refreshBtn?.addEventListener("click", loadDashboard);
});

async function loadDashboard() {
  const data = await fetchDashboardData();
  renderDashboard(data);
}

function renderDashboard(data) {
  const { totals, registrationsByMonth, roles, geo, activity } = data;

  totalUsersEl && (totalUsersEl.textContent = totals.total);
  usersCountEl && (usersCountEl.textContent = roles.USER);
  carersCountEl && (carersCountEl.textContent = roles.CARER);
  activeVsInactiveEl && (activeVsInactiveEl.textContent = `${activity.active} / ${activity.inactive}`);

  renderLineChart("registrationsChart", registrationsByMonth.labels, registrationsByMonth.values, "Nuevos registros");
  renderPieChart("rolesChart", ["Usuarios", "Cuidadores"], [roles.USER, roles.CARER]);
  renderBarChart("geoChart", geo.labels, geo.values, "Distribución geográfica");
  renderDoughnut("activityChart", ["Activos", "Inactivos"], [activity.active, activity.inactive]);
}

function renderLineChart(id, labels, values, label) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  destroyChart(id);
  charts[id] = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label,
          data: values,
          borderColor: "#4dabf7",
          backgroundColor: "rgba(77, 171, 247, 0.25)",
          fill: true,
          tension: 0.35,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } },
      },
    },
  });
}

function renderPieChart(id, labels, values) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  destroyChart(id);
  charts[id] = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: ["#5c7cfa", "#20c997"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } },
    },
  });
}

function renderBarChart(id, labels, values, label) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  destroyChart(id);
  charts[id] = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label,
          data: values,
          backgroundColor: "#5c7cfa",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } },
      },
    },
  });
}

function renderDoughnut(id, labels, values) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  destroyChart(id);
  charts[id] = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: ["#51cf66", "#adb5bd"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } },
      cutout: "60%",
    },
  });
}

function destroyChart(id) {
  if (charts[id]) {
    charts[id].destroy();
    delete charts[id];
  }
}

async function fetchDashboardData() {
  try {
    const [users, carers, streets] = await Promise.all([
      getAllUsersSafe(),
      getCarersSafe(),
      getAllStreetsSafe(),
    ]);
    const total = users.length;
    const rolesCount = countRoles(users);
    const geo = buildGeoDistribution(streets);
    const registrations = placeholderRegistrations();
    const activity = { active: users.length, inactive: 0 };

    return {
      totals: { total },
      roles: { USER: rolesCount.USER, CARER: rolesCount.CARETAKER + carers.length },
      registrationsByMonth: registrations,
      geo,
      activity,
    };
  } catch (error) {
    console.error("Error cargando dashboard:", error);
    return sampleFallback();
  }
}

async function getAllUsersSafe() {
  try {
    const res = await getAllUsers();
    return Array.isArray(res) ? res : [];
  } catch (e) {
    console.error("getAllUsers fallback:", e);
    return [];
  }
}

async function getCarersSafe() {
  try {
    const res = await getCarers();
    return Array.isArray(res) ? res : [];
  } catch (e) {
    console.error("getCarers fallback:", e);
    return [];
  }
}

async function getAllStreetsSafe() {
  try {
    const res = await getAllStreets();
    return Array.isArray(res) ? res : [];
  } catch (e) {
    console.error("getAllStreets fallback:", e);
    return [];
  }
}

function countRoles(users = []) {
  const acc = { USER: 0, CARETAKER: 0 };
  users.forEach((u) => {
    const role = (u.role || "").toUpperCase();
    if (role === "CARETAKER") acc.CARETAKER += 1;
    else acc.USER += 1;
  });
  return acc;
}

function placeholderRegistrations() {
  return {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    values: [12, 18, 22, 25, 30, 28, 34, 32, 27, 24, 20, 26],
  };
}

function placeholderGeo() {
  return {
    labels: ["Buenos Aires", "Córdoba", "Mendoza", "Rosario", "Tucumán"],
    values: [0, 0, 0, 0, 0],
  };
}

function buildGeoDistribution(streets = []) {
  if (!streets.length) return placeholderGeo();
  const cityCounts = new Map();
  streets.forEach((street) => {
    const city = street?.city?.name || "Sin ciudad";
    cityCounts.set(city, (cityCounts.get(city) || 0) + 1);
  });
  const labels = Array.from(cityCounts.keys());
  const values = Array.from(cityCounts.values());
  return { labels, values };
}

function sampleFallback() {
  return {
    totals: { total: 0 },
    roles: { USER: 0, CARER: 0 },
    registrationsByMonth: placeholderRegistrations(),
    geo: placeholderGeo(),
    activity: { active: 0, inactive: 0 },
  };
}
