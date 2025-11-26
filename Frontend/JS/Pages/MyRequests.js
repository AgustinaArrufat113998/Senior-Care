import { getAllCareRequests } from "../Api/CareRequest.js";

const userList = document.getElementById("userRequestsList");
const carerList = document.getElementById("carerRequestsList");
const roleBadge = document.getElementById("roleBadge");
const infoBox = document.getElementById("requestsMessage");
const userCount = document.getElementById("userCount");
const carerCount = document.getElementById("carerCount");
const carerBlock = document.getElementById("carerBlock");

const statusStyles = {
  PENDING: "bg-warning text-dark",
  ACCEPTED: "bg-success",
  REJECTED: "bg-danger",
  CANCELLED: "bg-secondary",
  COMPLETED: "bg-primary",
};

document.addEventListener("DOMContentLoaded", async () => {
  const userId = safeNumber(localStorage.getItem("userId"));
  const storedRole = (localStorage.getItem("userRole") || "").toUpperCase();
  const carerId = safeNumber(localStorage.getItem("carerId"));

  setRoleLabel(storedRole);

  if (!userId) {
    showInfo("Debes iniciar sesion para ver tus solicitudes.");
    return;
  }

  if (storedRole !== "CARETAKER" && carerBlock) {
    carerBlock.classList.add("d-none");
  }

  showInfo("Cargando solicitudes...");
  try {
    const requests = await getAllCareRequests();
    renderUserRequests(requests, userId);
    renderCarerRequests(requests, carerId || userId, storedRole);
    showInfo("");
  } catch (error) {
    console.error("No se pudieron obtener las solicitudes:", error);
    showInfo("No se pudieron cargar las solicitudes. Intenta nuevamente.", true);
  }
});

function setRoleLabel(role) {
  if (!roleBadge) return;
  roleBadge.textContent = role === "CARETAKER" ? "Caretaker" : "Usuario";
}

function renderUserRequests(requests, userId) {
  if (!userList) return;
  const mine = (requests || []).filter((req) => {
    const requesterId = safeNumber(req.requesterId) || safeNumber(req.userId);
    return requesterId === userId;
  });
  userCount && (userCount.textContent = mine.length);
  renderList(mine, userList, "Aun no creaste solicitudes.");
}

function renderCarerRequests(requests, carerId, role) {
  if (!carerList) return;
  if (role !== "CARETAKER") {
    carerCount && (carerCount.textContent = "0");
    carerList.innerHTML = '<p class="text-muted small mb-0">No eres caretaker.</p>';
    return;
  }
  const mine = (requests || []).filter((req) => safeNumber(req.carerId) === carerId);
  carerCount && (carerCount.textContent = mine.length);
  renderList(mine, carerList, carerId ? "No tienes cuidados asignados." : "No encontramos tu carerId.");
}

function renderList(list, container, emptyMessage) {
  container.innerHTML = "";
  if (!list.length) {
    container.innerHTML = `<div class="empty-state">${emptyMessage}</div>`;
    return;
  }

  list.forEach((req) => {
    const status = (req.status || "PENDING").toUpperCase();
    const badgeClass = statusStyles[status] || "bg-secondary";
    const startDate = formatDate(req.startDate);
    const endDate = formatDate(req.endDate);
    const timeRange = buildTimeRange(req.startTime, req.endTime);
    const gender = req.genderPreference || "Sin preferencia";
    const emergency = req.emergencyPhone || "No informado";
    const carerId = req.carerId ?? "—";

    const card = document.createElement("div");
    card.className = "request-card shadow-sm";
    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div>
          <p class="mb-0 text-muted small">Solicitud #${req.id ?? "-"}</p>
          <h6 class="fw-bold mb-0">Estado: <span class="badge ${badgeClass}">${status}</span></h6>
        </div>
        <div class="text-end small text-muted">
          <div>${startDate}${endDate ? ` · ${endDate}` : ""}</div>
          ${timeRange ? `<div>${timeRange}</div>` : ""}
        </div>
      </div>
      <div class="small text-muted mb-1">Genero preferido: <span class="text-dark">${gender}</span></div>
      <div class="small text-muted mb-1">Tel. emergencia: <span class="text-dark">${emergency}</span></div>
      <div class="small text-muted mb-1">Especialidades: <span class="text-dark">${formatSpecialties(req.specialtyIds)}</span></div>
      <div class="small text-muted">Cuidador asignado: <span class="text-dark">${carerId || "Sin asignar"}</span></div>
    `;

    container.appendChild(card);
  });
}

function formatSpecialties(ids = []) {
  if (!ids || !ids.length) return "No especificadas";
  return Array.from(ids).join(", ");
}

function buildTimeRange(start, end) {
  if (!start && !end) return "";
  if (start && end) return `${start} - ${end}`;
  return start || end || "";
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("es-AR", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

function showInfo(message, isError = false) {
  if (!infoBox) return;
  infoBox.textContent = message;
  infoBox.className = isError ? "text-danger fw-semibold" : "text-muted";
}

function safeNumber(value) {
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}
