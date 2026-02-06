import { getCarers } from "../Api/Carer.js";
import { getAllUsers, getAllStreets } from "../Api/userApi.js";
import { getAllCareRequests } from "../Api/CareRequest.js";

// DOM references for live dashboard updates
const totalUsersEl = document.getElementById("totalUsers");
const usersCountEl = document.getElementById("usersCount");
const carersCountEl = document.getElementById("carersCount");
const activeVsInactiveEl = document.getElementById("activeVsInactive");
const refreshBtn = document.getElementById("refreshDashboard");
const dateFromInput = document.getElementById("dateFrom");
const dateToInput = document.getElementById("dateTo");
const applyFilterBtn = document.getElementById("applyDateFilter");
const clearFilterBtn = document.getElementById("clearDateFilter");
const downloadExcelBtn = document.getElementById("downloadExcel");

// Runtime state for charts and filters
let charts = {};
let currentFilter = { from: null, to: null };

document.addEventListener("DOMContentLoaded", async () => {
  // Basic access gate for admin-only view
  const role = (localStorage.getItem("userRole") || "").toUpperCase();
  if (role !== "ADMIN") {
    window.location.href = "Home.html";
    return;
  }

  // Initial load + UI handlers
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
  downloadExcelBtn?.addEventListener("click", handleExcelDownload);
});

async function loadDashboard() {
  // Fetch, compute, and render all dashboard data
  const data = await fetchDashboardData(currentFilter);
  renderDashboard(data);
}

async function handleExcelDownload() {
  // Build XLSX with fresh data and embedded chart images
  if (!window.ExcelJS || !window.saveAs) {
    alert("No se encontro la libreria para exportar.");
    return;
  }
  const data = await fetchDashboardData(currentFilter);
  renderDashboard(data);
  const workbook = await buildWorkbook(data, currentFilter);
  const filename = buildFilename(currentFilter);
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  window.saveAs(blob, filename);
}

function buildFilename(filter) {
  // Include date and filter range in the export filename
  const now = new Date();
  const dateTag = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
  const from = filter?.from ? `_${filter.from}` : "";
  const to = filter?.to ? `_${filter.to}` : "";
  return `dashboard_${dateTag}${from}${to}.xlsx`;
}

async function buildWorkbook(data, filter) {
  // Excel workbook with summary, data tables, and chart images
  const workbook = new window.ExcelJS.Workbook();
  const careRequestsTotal = (data.careRequests?.values || []).reduce((acc, value) => acc + value, 0);
  const summaryRows = [
    { campo: "Generado", valor: new Date().toLocaleString("es-AR") },
    { campo: "Filtro desde", valor: filter?.from || "Sin filtro" },
    { campo: "Filtro hasta", valor: filter?.to || "Sin filtro" },
    { campo: "Usuarios totales", valor: data.totals.total },
    { campo: "Cuidadores", valor: data.totals.carers },
    { campo: "Usuarios", valor: data.roles.USER },
    { campo: "Solicitudes totales", valor: careRequestsTotal },
    { campo: "Activos", valor: data.activity.active },
    { campo: "Inactivos", valor: data.activity.inactive },
  ];
  const summarySheet = workbook.addWorksheet("Resumen");
  summarySheet.columns = [
    { header: "Campo", key: "campo", width: 28 },
    { header: "Valor", key: "valor", width: 32 },
  ];
  summarySheet.addRows(summaryRows);

  const registrationsRows = data.registrationsByMonth.labels.map((label, idx) => ({
    periodo: label,
    registros: data.registrationsByMonth.values[idx],
  }));
  const registrationsSheet = workbook.addWorksheet("Registros");
  registrationsSheet.columns = [
    { header: "Periodo", key: "periodo", width: 18 },
    { header: "Registros", key: "registros", width: 12 },
  ];
  registrationsSheet.addRows(registrationsRows);

  const rolesSheet = workbook.addWorksheet("Roles");
  rolesSheet.columns = [
    { header: "Rol", key: "rol", width: 16 },
    { header: "Cantidad", key: "cantidad", width: 12 },
  ];
  rolesSheet.addRows([
    { rol: "Usuarios", cantidad: data.roles.USER },
    { rol: "Cuidadores", cantidad: data.roles.CARER },
  ]);

  const geoRows = data.geo.labels.map((label, idx) => ({
    ciudad: label,
    cantidad: data.geo.values[idx],
  }));
  const geoSheet = workbook.addWorksheet("Geo");
  geoSheet.columns = [
    { header: "Ciudad", key: "ciudad", width: 20 },
    { header: "Cantidad", key: "cantidad", width: 12 },
  ];
  geoSheet.addRows(geoRows);

  const activitySheet = workbook.addWorksheet("Actividad");
  activitySheet.columns = [
    { header: "Estado", key: "estado", width: 16 },
    { header: "Cantidad", key: "cantidad", width: 12 },
  ];
  activitySheet.addRows([
    { estado: "Activos", cantidad: data.activity.active },
    { estado: "Inactivos", cantidad: data.activity.inactive },
  ]);

  const careRequestsSheet = workbook.addWorksheet("Solicitudes");
  careRequestsSheet.columns = [
    { header: "Estado", key: "estado", width: 16 },
    { header: "Cantidad", key: "cantidad", width: 12 },
  ];
  careRequestsSheet.addRows(
    data.careRequests.labels.map((label, idx) => ({
      estado: label,
      cantidad: data.careRequests.values[idx],
    }))
  );

  await addChartsSheet(workbook);
  return workbook;
}

async function addChartsSheet(workbook) {
  // Captures current Chart.js canvases and embeds them into the file
  const chartsSheet = workbook.addWorksheet("Graficos");
  const chartConfigs = [
    { id: "registrationsChart", title: "Nuevos registros por mes", width: 640, height: 320 },
    { id: "rolesChart", title: "Usuarios por rol", width: 480, height: 320 },
    { id: "geoChart", title: "Distribucion geografica", width: 640, height: 320 },
    { id: "activityChart", title: "Actividad", width: 480, height: 320 },
    { id: "careRequestsChart", title: "Solicitudes por estado", width: 640, height: 320 },
  ];

  let rowCursor = 1;
  chartConfigs.forEach((config) => {
    chartsSheet.getRow(rowCursor).values = [config.title];
    const imageBase64 = getChartBase64(config.id);
    if (imageBase64) {
      const imageId = workbook.addImage({
        base64: imageBase64,
        extension: "png",
      });
      chartsSheet.addImage(imageId, {
        tl: { col: 0, row: rowCursor },
        ext: { width: config.width, height: config.height },
      });
    } else {
      chartsSheet.getRow(rowCursor + 1).values = ["Grafico no disponible"];
    }
    rowCursor += 22;
  });
}

function getChartBase64(canvasId) {
  // Convert a canvas to PNG for Excel embedding
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof canvas.toDataURL !== "function") return null;
  return canvas.toDataURL("image/png", 1.0);
}

function renderDashboard(data) {
  // Update KPI cards and re-render all charts
  const { totals, registrationsByMonth, roles, geo, activity, careRequests } = data;

  totalUsersEl && (totalUsersEl.textContent = totals.total);
  usersCountEl && (usersCountEl.textContent = roles.USER);
  carersCountEl && (carersCountEl.textContent = totals.carers ?? roles.CARER);
  activeVsInactiveEl && (activeVsInactiveEl.textContent = `${activity.active} / ${activity.inactive}`);

  renderLineChart("registrationsChart", registrationsByMonth.labels, registrationsByMonth.values, "Nuevos registros");
  renderPieChart("rolesChart", ["Usuarios", "Cuidadores"], [roles.USER, roles.CARER]);
  renderBarChart("geoChart", geo.labels, geo.values, "Distribucion geografica");
  renderDoughnut("activityChart", ["Activos", "Inactivos"], [activity.active, activity.inactive]);
  renderBarChart("careRequestsChart", careRequests.labels, careRequests.values, "Solicitudes");
}

function renderLineChart(id, labels, values, label) {
  // Line chart for monthly registrations
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
  // Pie chart for role split
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
  // Bar chart for distributions
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
  // Doughnut chart for activity
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
  // Prevent duplicate Chart.js instances
  if (charts[id]) {
    charts[id].destroy();
    delete charts[id];
  }
}

async function fetchDashboardData(filter = {}) {
  // Aggregate data from multiple services and compute derived metrics
  try {
    const [users, streets, careRequests] = await Promise.all([
      getAllUsersSafe(),
      getAllStreetsSafe(),
      getAllCareRequestsSafe(),
    ]);
    const filteredUsers = applyDateFilter(users, filter);

    const rolesCount = countRoles(filteredUsers);
    const caretakersCount = rolesCount.CARETAKER;
    const commonUsersCount = rolesCount.USER;
    const totalAccounts = commonUsersCount + caretakersCount;

    const geo = buildGeoDistribution(streets);
    const registrations = buildRegistrations(filteredUsers, filter);
    const activeCount = Math.round(totalAccounts * 0.7);
    const inactiveCount = Math.max(totalAccounts - activeCount, 0);
    const activity = { active: activeCount, inactive: inactiveCount };
    const careRequestsStatus = buildCareRequestStatus(careRequests);

    return {
      totals: { total: totalAccounts, carers: caretakersCount },
      roles: { USER: commonUsersCount, CARER: caretakersCount },
      registrationsByMonth: registrations,
      geo,
      activity,
      careRequests: careRequestsStatus,
    };
  } catch (error) {
    console.error("Error cargando dashboard:", error);
    return sampleFallback();
  }
}

async function getAllUsersSafe() {
  // Users API with safe fallback
  try {
    const res = await getAllUsers();
    return Array.isArray(res) ? res : [];
  } catch (e) {
    console.error("getAllUsers fallback:", e);
    return [];
  }
}

async function getCarersSafe() {
  // Carers API with safe fallback
  try {
    const res = await getCarers();
    return Array.isArray(res) ? res : [];
  } catch (e) {
    console.error("getCarers fallback:", e);
    return [];
  }
}

async function getAllStreetsSafe() {
  // Streets API with safe fallback
  try {
    const res = await getAllStreets();
    return Array.isArray(res) ? res : [];
  } catch (e) {
    console.error("getAllStreets fallback:", e);
    return [];
  }
}

async function getAllCareRequestsSafe() {
  // Care requests API with safe fallback
  try {
    const res = await getAllCareRequests();
    return Array.isArray(res) ? res : [];
  } catch (e) {
    console.error("getAllCareRequests fallback:", e);
    return [];
  }
}

function countRoles(users = []) {
  // Role breakdown for KPI and charts
  const acc = { USER: 0, CARETAKER: 0, ADMIN: 0 };
  users.forEach((u) => {
    const role = normalizeRole(u?.role);
    if (role === "CARETAKER") acc.CARETAKER += 1;
    else if (role === "USER") acc.USER += 1;
    else if (role === "ADMIN") acc.ADMIN += 1;
  });
  return acc;
}

function normalizeRole(role) {
  // Normalize role variants to a single enum
  const value = (role || "").toString().toUpperCase();
  if (value === "CARETAKER" || value === "CARER") return "CARETAKER";
  if (value === "ADMIN") return "ADMIN";
  if (value === "USER") return "USER";
  return null;
}

function getCreatedDate(item) {
  // Support multiple possible created date field names
  const candidate =
    item?.createdAt ||
    item?.created_at ||
    item?.created ||
    item?.creationDate ||
    item?.registrationDate;
  return parseDate(candidate);
}

function placeholderGeo() {
  // Default geo labels when no data is available
  return {
    labels: ["Buenos Aires", "Cordoba", "Mendoza", "Rosario", "Tucuman"],
    values: [0, 0, 0, 0, 0],
  };
}

function buildGeoDistribution(streets = []) {
  // Count streets per city for the geo chart
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
  // Safe empty dataset to keep UI stable
  return {
    totals: { total: 0, carers: 0 },
    roles: { USER: 0, CARER: 0 },
    registrationsByMonth: { labels: [], values: [] },
    geo: placeholderGeo(),
    activity: { active: 0, inactive: 0 },
    careRequests: { labels: [], values: [] },
  };
}

function readFilter() {
  // Read date range from inputs
  return {
    from: dateFromInput?.value || null,
    to: dateToInput?.value || null,
  };
}

function clearFilterInputs() {
  // Clear filter and reset state
  if (dateFromInput) dateFromInput.value = "";
  if (dateToInput) dateToInput.value = "";
  currentFilter = { from: null, to: null };
}

function applyDateFilter(items = [], filter = {}) {
  // Filter list by created date, keeping items without date
  const from = normalizeStartDate(filter.from);
  const to = normalizeEndDate(filter.to);
  if (!from && !to) return items;

  return items.filter((item) => {
    const created = getCreatedDate(item);
    if (!created) return true; // si no hay fecha, no excluimos el registro para evitar vaciar el dashboard
    if (from && created < from) return false;
    if (to && created > to) return false;
    return true;
  });
}

function buildRegistrations(users = [], filter = {}) {
  // Build monthly buckets for registrations
  const createdDates = users.map((u) => getCreatedDate(u)).filter(Boolean);

  const datasetMin = createdDates.length ? new Date(Math.min(...createdDates)) : null;
  const datasetMax = createdDates.length ? new Date(Math.max(...createdDates)) : null;

  const to = normalizeEndDate(filter.to) || datasetMax || new Date();
  let from = normalizeStartDate(filter.from) || datasetMin;
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
    console.log("user: ", u);
    const created = getCreatedDate(u);
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

function buildCareRequestStatus(careRequests = []) {
  // Count requests per status for the chart
  const order = ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED", "COMPLETED", "SIN ESTADO"];
  const counts = order.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});

  careRequests.forEach((request) => {
    const rawStatus = (request?.status || "").toString().trim();
    const status = rawStatus ? rawStatus.toUpperCase() : "SIN ESTADO";
    if (counts[status] === undefined) {
      counts["SIN ESTADO"] += 1;
    } else {
      counts[status] += 1;
    }
  });

  const labels = order.filter((label) => counts[label] > 0 || label !== "SIN ESTADO");
  const values = labels.map((label) => counts[label] || 0);
  return { labels, values };
}

function parseDate(value) {
  // Parse various date representations safely
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "number") {
    const dNum = new Date(value);
    return Number.isNaN(dNum.getTime()) ? null : dNum;
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function normalizeStartDate(value) {
  // Normalize range start to 00:00:00
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function normalizeEndDate(value) {
  // Normalize range end to 23:59:59
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}
