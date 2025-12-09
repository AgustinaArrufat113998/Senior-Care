/************************************************************
 * IMPORTS
 ************************************************************/
import { getAllCareRequests, updateCareRequestStatus } from "../Api/CareRequest.js";
import { getCarers } from "../Api/Carer.js";

/************************************************************
 * ELEMENTOS DEL DOM
 ************************************************************/
const userList = document.getElementById("userRequestsList");
const userBlock = userList ? userList.closest("section") : null;
const carerList = document.getElementById("carerRequestsList");
const carerBlock = document.getElementById("carerBlock");

const roleBadge = document.getElementById("roleBadge");
const infoBox = document.getElementById("requestsMessage");
const userCount = document.getElementById("userCount");
const carerCount = document.getElementById("carerCount");

// Modal detalle caretaker
const modalEl = document.getElementById("carerRequestModal");
const modalRequestId = document.getElementById("modalRequestId");
const modalRequestStatus = document.getElementById("modalRequestStatus");
const modalRequestDates = document.getElementById("modalRequestDates");
const modalRequestTime = document.getElementById("modalRequestTime");
const modalRequestGender = document.getElementById("modalRequestGender");
const modalRequestPhone = document.getElementById("modalRequestPhone");
const modalRequestSpecs = document.getElementById("modalRequestSpecs");
const modalRequestNotes = document.getElementById("modalRequestNotes");
const modalAcceptBtn = document.getElementById("modalAcceptBtn");
const modalRejectBtn = document.getElementById("modalRejectBtn");

/************************************************************
 * CONSTANTES / ESTADO
 ************************************************************/
let carerRequestsCache = [];
let carersById = new Map();

/************************************************************
 * INIT
 ************************************************************/
document.addEventListener("DOMContentLoaded", async () => {
  const userId = safeNumber(localStorage.getItem("userId"));
  const storedRole = (localStorage.getItem("userRole") || "").toUpperCase();

  // Resolver carerId desde backend si el usuario es caretaker
  let carerId = safeNumber(localStorage.getItem("carerId"));
  const carers = await getCarers();
  carersById = new Map((carers || []).map((c) => [String(c.id), c]));
  if (!carerId && carers?.length) {
    carerId = carers.find((c) => Number(c.userId) === userId)?.id || null;
    if (carerId) localStorage.setItem("carerId", String(carerId));
  }

  setRoleLabel(storedRole);

  if (!userId) {
    showInfo("Debes iniciar sesion para ver tus solicitudes.");
    return;
  }

  if (storedRole !== "CARETAKER" && carerBlock) {
    carerBlock.classList.add("d-none");
  } else if (storedRole === "CARETAKER" && userBlock) {
    userBlock.classList.add("d-none");
  }

  showInfo("Cargando solicitudes...");

  try {
    const requests = await getAllCareRequests();
    renderUserRequests(requests, userId);
    renderCarerRequests(requests, carerId, storedRole);
    showInfo("");
  } catch (error) {
    console.error("No se pudieron obtener las solicitudes:", error);
    showInfo("No se pudieron cargar las solicitudes. Intenta nuevamente.", true);
  }
});

/************************************************************
 * UI helpers
 ************************************************************/
function setRoleLabel(role) {
  if (!roleBadge) return;
  roleBadge.textContent = role === "CARETAKER" ? "Caretaker" : "Usuario";
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

/************************************************************
 * Render usuario
 ************************************************************/
function renderUserRequests(requests, userId) {
  if (!userList) return;
  const mine = (requests || []).filter((req) => {
    const requesterId = safeNumber(req.requesterId) || safeNumber(req.userId);
    return requesterId === userId;
  });
  if (userCount) userCount.textContent = mine.length;
  renderList(mine, userList, "Aun no creaste solicitudes.", { showActions: false, allowRating: true });
}

/************************************************************
 * Render caretaker
 ************************************************************/
function renderCarerRequests(requests, carerId, role) {
  if (!carerList) return;
  if (role !== "CARETAKER") {
    if (carerCount) carerCount.textContent = "0";
    carerList.innerHTML = '<p class="text-muted small mb-0">No eres caretaker.</p>';
    return;
  }

  const mine = (requests || []).filter((req) => safeNumber(req.carerId) === carerId);
  carerRequestsCache = mine;
  if (carerCount) carerCount.textContent = mine.length;
  renderList(
    mine,
    carerList,
    carerId ? "No tienes cuidados asignados." : "No encontramos tu carerId.",
    { showActions: true, allowRating: false }
  );
}

/************************************************************
 * Render generico de tarjetas
 ************************************************************/
function renderList(list, container, emptyMessage, options = { showActions: false, allowRating: false }) {
  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = `<div class="empty-state">${emptyMessage}</div>`;
    return;
  }

  list.forEach((req) => {
    const status = (req.status || "PENDING").toUpperCase();
    const badgeClass = getBadgeClass(status);
    const badgeStyle = getBadgeStyle(status);
    const startDate = formatDate(req.startDate);
    const endDate = formatDate(req.endDate);
    const timeRange = buildTimeRange(req.startTime, req.endTime);
    const gender = req.genderPreference || "Sin preferencia";
    const emergency = req.emergencyPhone || "No informado";
    const carerId = req.carerId ?? "";
    const isReadOnly = status === "REJECTED" || status === "CANCELLED" || status === "COMPLETED";
    const carerLabel = getCarerLabel(carerId);
    const canRate = options.allowRating && status === "COMPLETED" && carerId;

    const card = document.createElement("div");
    card.className = "request-card shadow-sm";
    if (status === "REJECTED" || status === "CANCELLED") {
      card.classList.add("opacity-75");
      card.style.backgroundColor = "#f8f9fa";
      card.style.color = "#495057";
    }
    if (status === "COMPLETED") {
      card.classList.add("opacity-75");
      card.style.backgroundColor = "#fff7d6";
    }
    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div>
          <p class="mb-0 text-muted small">Solicitud #${req.id ?? "-"}</p>
          <h6 class="fw-bold mb-0">
            Estado: <span class="badge ${badgeClass}"${badgeStyle ? ` style="${badgeStyle}"` : ""}>${status}</span>
          </h6>
        </div>
        <div class="text-end small text-muted">
          <div>${startDate}${endDate ? ` - ${endDate}` : ""}</div>
          ${timeRange ? `<div>${timeRange}</div>` : ""}
        </div>
      </div>
      <div class="small text-muted mb-1">
        Genero preferido: <span class="text-dark">${gender}</span>
      </div>
      <div class="small text-muted mb-1">
        Tel. emergencia: <span class="text-dark">${emergency}</span>
      </div>
      <div class="small text-muted mb-1">
        Especialidades: <span class="text-dark">${formatSpecialties(req.specialtyIds)}</span>
      </div>
      <div class="small text-muted">
        Cuidador asignado: <span class="text-dark">${carerLabel || "Sin asignar"}</span>
      </div>
      ${
        options.showActions && req.id
          ? `<div class="mt-3 text-end">
               <button class="btn btn-outline-primary btn-sm view-request-btn" data-request-id="${req.id}" ${isReadOnly ? "" : ""}>Ver detalle</button>
             </div>`
        : canRate
          ? `<div class="mt-3 text-end">
               <button class="btn btn-primary btn-sm rate-request-btn" data-carer-id="${carerId}" data-request-id="${req.id}">
                 Calificar servicio
               </button>
             </div>`
          : ""
      }
    `;
    container.appendChild(card);
  });

  if (options.showActions) {
    container.querySelectorAll(".view-request-btn").forEach((btn) => {
      btn.addEventListener("click", () => openCarerModal(btn.dataset.requestId));
    });
  }
  if (options.allowRating) {
    container.querySelectorAll(".rate-request-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const carerId = btn.dataset.carerId;
        const requestId = btn.dataset.requestId;
        redirectToRating(carerId, requestId);
      });
    });
  }
}

/************************************************************
 * Modal caretaker
 ************************************************************/
function openCarerModal(requestId) {
  if (!modalEl) return;
  const req = carerRequestsCache.find((r) => String(r.id) === String(requestId));
  if (!req) return;

  const status = (req.status || "PENDING").toUpperCase();
  const badgeClass = getBadgeClass(status);
  const startDate = formatDate(req.startDate);
  const endDate = formatDate(req.endDate);
  const timeRange = buildTimeRange(req.startTime, req.endTime);
  const gender = req.genderPreference || "Sin preferencia";
  const emergency = req.emergencyPhone || "No informado";
  const specialties = formatSpecialties(req.specialtyIds);
  const notes = req.careSuggestions || req.additionalInfo || "Sin notas";

  if (modalRequestId) modalRequestId.textContent = req.id ?? "-";
  if (modalRequestStatus) {
    modalRequestStatus.textContent = status;
    modalRequestStatus.className = `badge ${badgeClass}`;
    modalRequestStatus.style = getBadgeStyle(status);
  }
  if (modalRequestDates) modalRequestDates.textContent = `${startDate}${endDate ? ` - ${endDate}` : ""}`;
  if (modalRequestTime) modalRequestTime.textContent = timeRange || "No informado";
  if (modalRequestGender) modalRequestGender.textContent = gender;
  if (modalRequestPhone) modalRequestPhone.textContent = emergency;
  if (modalRequestSpecs) modalRequestSpecs.textContent = specialties;
  if (modalRequestNotes) modalRequestNotes.textContent = notes;

  configureModalButtons(status, req.id);

  const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
  modalInstance.show();
}

function configureModalButtons(status, requestId) {
  const resetBtn = (btn, text, classes, disabled, handler) => {
    if (!btn) return null;
    const newBtn = btn.cloneNode(true);
    newBtn.id = btn.id;
    newBtn.textContent = text;
    newBtn.className = classes;
    newBtn.disabled = disabled;
    btn.replaceWith(newBtn);
    if (handler && !disabled) {
      newBtn.addEventListener("click", handler);
    }
    return newBtn;
  };

  if (status === "PENDING") {
    resetBtn(
      modalRejectBtn,
      "Rechazar",
      "btn btn-outline-danger",
      false,
      () => updateRequestStatus(requestId, "REJECTED")
    );
    resetBtn(
      modalAcceptBtn,
      "Aceptar cuidado",
      "btn btn-success",
      false,
      () => updateRequestStatus(requestId, "ACCEPTED")
    );
    return;
  }

  if (status === "ACCEPTED") {
    resetBtn(
      modalRejectBtn,
      "Cancelar",
      "btn btn-outline-danger",
      false,
      () => updateRequestStatus(requestId, "CANCELLED")
    );
    resetBtn(
      modalAcceptBtn,
      "Finalizar",
      "btn btn-warning text-dark",
      false,
      () => updateRequestStatus(requestId, "COMPLETED")
    );
    return;
  }

  if (status === "REJECTED") {
    resetBtn(modalRejectBtn, "Rechazada", "btn btn-outline-danger", true, null);
    resetBtn(modalAcceptBtn, "Sin acciones", "btn btn-secondary", true, null);
    return;
  }

  if (status === "CANCELLED") {
    resetBtn(modalRejectBtn, "Cancelada", "btn btn-danger", true, null);
    resetBtn(modalAcceptBtn, "Sin acciones", "btn btn-secondary", true, null);
    return;
  }

  if (status === "COMPLETED") {
    resetBtn(modalRejectBtn, "Completada", "btn btn-secondary", true, null);
    resetBtn(modalAcceptBtn, "Sin acciones", "btn btn-warning text-dark", true, null);
    return;
  }
}

async function updateRequestStatus(id, status) {
  try {
    await updateCareRequestStatus(id, status);
    carerRequestsCache = carerRequestsCache.map((req) =>
      String(req.id) === String(id) ? { ...req, status } : req
    );
    renderCarerRequests(
      carerRequestsCache,
      safeNumber(localStorage.getItem("carerId")),
      "CARETAKER"
    );
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance?.hide();
  } catch (error) {
    console.error("No se pudo actualizar la solicitud:", error);
    showInfo("No se pudo actualizar la solicitud.", true);
  }
}

/************************************************************
 * Format helpers
 ************************************************************/
function formatSpecialties(ids = []) {
  if (!ids.length) return "No especificadas";
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
    return date.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getBadgeClass(status) {
  switch (status) {
    case "PENDING":
      return "bg-warning text-dark";
    case "ACCEPTED":
      return "bg-success text-white";
    case "REJECTED":
      return "bg-light border border-danger";
    case "CANCELLED":
      return "bg-danger text-white";
    case "COMPLETED":
      return "bg-warning text-dark";
    default:
      return "bg-secondary";
  }
}

function getBadgeStyle(status) {
  if (status === "REJECTED") {
    return "color:#495057;";
  }
  return "";
}

function getCarerLabel(carerId) {
  if (!carerId) return "";
  const carer = carersById.get(String(carerId));
  if (!carer) return `ID ${carerId}`;
  const first = carer.firstName || "";
  const last = carer.lastName || "";
  const name = `${first} ${last}`.trim();
  return name || `ID ${carer.id}`;
}

function redirectToRating(carerId, requestId) {
  if (!carerId) return;
  const carer = carersById.get(String(carerId));
  const carerName = carer ? encodeURIComponent(`${carer.firstName || ""} ${carer.lastName || ""}`.trim()) : "";
  const qs = new URLSearchParams({
    carerId,
    requestId: requestId || "",
    carerName,
  });
  window.location.href = `CareRating.html?${qs.toString()}`;
}
