import { getCarers } from "../Api/Carer.js";
import { getAllUsers, getAllStreets } from "../Api/userApi.js";

const totalUsersEl = document.getElementById("totalUsers");
const usersCountEl = document.getElementById("usersCount");
const carersCountEl = document.getElementById("carersCount");
const activeVsInactiveEl = document.getElementById("activeVsInactive");
const refreshBtn = document.getElementById("refreshDashboard");
const dateFromInput = document.getElementById("dateFrom");
const dateToInput = document.getElementById("dateTo");
const applyFilterBtn = document.getElementById("applyDateFilter");
const clearFilterBtn = document.getElementById("clearDateFilter");

let charts = {};
let currentFilter = { from: null, to: null };

document.addEventListener("DOMContentLoaded", async () => {
  const role = (localStorage.getItem("userRole") || "").toUpperCase();
  // if (role !== "ADMIN") {
  //   window.location.href = "Home.html";
  //   return;
  // }

  await loadDashboard();
  refreshBtn?.addEventListener("click", loadDashboard);
  applyFilterBtn?.addEventListener("click", () => {
    currentFilter = readFilter();
    loadDashboard();
  });
  clearFilterBtn?.addEventListener("click", () => {
    clearFilterInputs();
    loadDashboard();
  });
});

async function loadDashboard() {
  const data = await fetchDashboardData(currentFilter);
  renderDashboard(data);
}

function renderDashboard(data) {
  const { totals, registrationsByMonth, roles, geo, activity } = data;

  totalUsersEl && (totalUsersEl.textContent = totals.total);
  usersCountEl && (usersCountEl.textContent = roles.USER);
  carersCountEl && (carersCountEl.textContent = totals.carers ?? roles.CARER);
  activeVsInactiveEl && (activeVsInactiveEl.textContent = `${activity.active} / ${activity.inactive}`);

  renderLineChart("registrationsChart", registrationsByMonth.labels, registrationsByMonth.values, "Nuevos registros");
  renderPieChart("rolesChart", ["Usuarios", "Cuidadores"], [roles.USER, roles.CARER]);
  renderBarChart("geoChart", geo.labels, geo.values, "Distribucion geografica");
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

async function fetchDashboardData(filter = {}) {
  try {
    const [users, carers, streets] = await Promise.all([
      getAllUsersSafe(),
      getCarersSafe(),
      getAllStreetsSafe(),
    ]);
    const filteredUsers = applyDateFilter(users, filter);
    const filteredCarers = applyDateFilter(carers, filter);
    const total = filteredUsers.length;
    const rolesCount = countRoles(filteredUsers);
    const geo = buildGeoDistribution(streets);
    const registrations = buildRegistrations(filteredUsers, filter);
    const activity = { active: filteredUsers.length, inactive: 0 };

    return {
      totals: { total, carers: filteredCarers.length },
      roles: { USER: rolesCount.USER, CARER: rolesCount.CARETAKER },
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

function placeholderGeo() {
  return {
    labels: ["Buenos Aires", "Cordoba", "Mendoza", "Rosario", "Tucuman"],
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
    totals: { total: 0, carers: 0 },
    roles: { USER: 0, CARER: 0 },
    registrationsByMonth: { labels: [], values: [] },
    geo: placeholderGeo(),
    activity: { active: 0, inactive: 0 },
  };
}

function readFilter() {
  return {
    from: dateFromInput?.value || null,
    to: dateToInput?.value || null,
  };
}

function clearFilterInputs() {
  if (dateFromInput) dateFromInput.value = "";
  if (dateToInput) dateToInput.value = "";
  currentFilter = { from: null, to: null };
}

function applyDateFilter(items = [], filter = {}) {
  const from = normalizeStartDate(filter.from);
  const to = normalizeEndDate(filter.to);
  if (!from && !to) return items;

  return items.filter((item) => {
    const created = parseDate(item?.createdAt);
    if (!created) return false;
    if (from && created < from) return false;
    if (to && created > to) return false;
    return true;
  });
}

function buildRegistrations(users = [], filter = {}) {
  const to = normalizeEndDate(filter.to) || new Date();
  let from = normalizeStartDate(filter.from);
  if (!from || from > to) {
    from = new Date(to.getFullYear(), to.getMonth() - 11, 1);
  }

  const startCursor = new Date(from.getFullYear(), from.getMonth(), 1);
  const endCursor = new Date(to.getFullYear(), to.getMonth(), 1);

  const buckets = [];
  const bucketIndex = new Map();
  let cursor = startCursor;
  const monthLabels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  while (cursor <= endCursor) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}`;
    const label = `${monthLabels[cursor.getMonth()]} ${String(cursor.getFullYear()).slice(-2)}`;
    bucketIndex.set(key, buckets.length);
    buckets.push({ key, label, count: 0 });
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }

  users.forEach((u) => {
    const created = parseDate(u?.createdAt);
    if (!created) return;
    if (created < from || created > to) return;
    const key = `${created.getFullYear()}-${created.getMonth()}`;
    const idx = bucketIndex.get(key);
    if (idx !== undefined) {
      buckets[idx].count += 1;
    }
  });

  return {
    labels: buckets.map((b) => b.label),
    values: buckets.map((b) => b.count),
  };
}

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function normalizeStartDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function normalizeEndDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}
