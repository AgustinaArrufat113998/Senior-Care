import { getCareRequestsByStatus, updateCareRequestStatus } from "../Api/CareRequest.js";
import { getUserById } from "../Api/userApi.js";

const pendingSelect = document.getElementById("pendingRequests");
const msgEl = document.getElementById("msg");

const fields = {
  pacienteNombre: document.getElementById("pacienteNombre"),
  pacienteEdad: document.getElementById("pacienteEdad"),
  pacienteCondiciones: document.getElementById("pacienteCondiciones"),
  pacienteEnfermedades: document.getElementById("pacienteEnfermedades"),
  fechaInicio: document.getElementById("fechaInicio"),
  fechaFin: document.getElementById("fechaFin"),
  horario: document.getElementById("horario"),
  direccion: document.getElementById("direccion"),
  tipoAtencion: document.getElementById("tipoAtencion"),
  obraSocial: document.getElementById("obraSocial"),
  metodoPago: document.getElementById("metodoPago"),
  tarifa: document.getElementById("tarifa"),
};

let pendingRequests = [];

const caretakerRole = () => {
  const storedRole = localStorage.getItem("userRole") || localStorage.getItem("seniorcareRole");
  return storedRole;
};

const getCaretakerId = () => {
  const user = JSON.parse(localStorage.getItem("userData") || "null");
  return user?.id || null;
};

function guardRole() {
  if (caretakerRole() !== "CARETAKER") {
    window.location.href = "Home.html";
  }
}

function showMessage(text, type = "info") {
  if (!msgEl) return;
  const colors = { info: "#0d6efd", success: "green", error: "red", warning: "orange" };
  msgEl.textContent = text;
  msgEl.style.color = colors[type] || "#0d6efd";
}

function populateSelect() {
  if (!pendingSelect) return;
  pendingSelect.innerHTML = "";

  if (!pendingRequests.length) {
    pendingSelect.innerHTML = '<option value="">No hay solicitudes pendientes</option>';
    return;
  }

  pendingRequests.forEach((req) => {
    const opt = document.createElement("option");
    opt.value = req.id;
    opt.textContent = `Solicitud #${req.id} - ${req.patientName || "Paciente"}`;
    pendingSelect.appendChild(opt);
  });

  pendingSelect.value = pendingRequests[0]?.id || "";
  renderRequest(pendingRequests[0]);
}

function renderRequest(req) {
  if (!req) {
    Object.values(fields).forEach((el) => el && (el.textContent = "-"));
    return;
  }

  fields.pacienteNombre.textContent = req.patientName || "Sin nombre";
  fields.pacienteEdad.textContent = req.patientAge ? `${req.patientAge} años` : "No informada";
  fields.pacienteCondiciones.textContent = req.conditions || "No informadas";
  fields.pacienteEnfermedades.textContent = req.diseases || "No informadas";

  fields.fechaInicio.textContent = req.startDate || "-";
  fields.fechaFin.textContent = req.endDate || "-";
  fields.horario.textContent = req.schedule || "-";
  fields.direccion.textContent = req.address || "-";
  fields.tipoAtencion.textContent = req.careType || "-";

  fields.obraSocial.textContent = req.healthInsurance || "No informada";
  fields.metodoPago.textContent = req.paymentMethod || "No informado";
  fields.tarifa.textContent = req.hourlyRate ? `$${req.hourlyRate}` : "No informada";
}

async function loadPending() {
  showMessage("Cargando solicitudes pendientes...", "info");
  try {
    const list = await getCareRequestsByStatus("PENDING");
    pendingRequests = Array.isArray(list) ? list : [];
    populateSelect();
    if (pendingRequests.length) {
      showMessage("Selecciona una solicitud para aceptarla o rechazarla.", "info");
    } else {
      showMessage("No hay solicitudes pendientes.", "warning");
    }
  } catch (error) {
    console.error("Error al obtener pendientes:", error);
    showMessage("Error al obtener solicitudes pendientes.", "error");
  }
}

async function handleAction(newStatus) {
  const selectedId = pendingSelect?.value;
  const caretakerId = getCaretakerId();

  if (!selectedId) {
    showMessage("Selecciona una solicitud.", "warning");
    return;
  }

  if (!caretakerId) {
    showMessage("No se encontró el usuario autenticado.", "error");
    return;
  }

  try {
    await updateCareRequestStatus(selectedId, newStatus);
    showMessage(
      newStatus === "ACCEPTED"
        ? "Solicitud aceptada. El familiar será notificado."
        : "Solicitud rechazada.",
      "success"
    );
    pendingRequests = pendingRequests.filter((r) => String(r.id) !== String(selectedId));
    populateSelect();
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    showMessage("No se pudo actualizar la solicitud.", "error");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  guardRole();
  await loadPending();

  pendingSelect?.addEventListener("change", (e) => {
    const req = pendingRequests.find((r) => String(r.id) === e.target.value);
    renderRequest(req);
  });

  document.getElementById("aceptarBtn")?.addEventListener("click", () => handleAction("ACCEPTED"));
  document.getElementById("rechazarBtn")?.addEventListener("click", () => handleAction("REJECTED"));
});
