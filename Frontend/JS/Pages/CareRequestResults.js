/******************************************************
 *  IMPORTS
 ******************************************************/
import { getCarers } from "../Api/Carer.js";
import { getAllCareRequests, updateCareRequest } from "../Api/CareRequest.js";

/******************************************************
 *  ELEMENTOS DEL DOM
 ******************************************************/
const resultadosContainer = document.getElementById("resultadosContainer");
const tipoFiltro = document.getElementById("tipoAtencionFiltro");
const generoFiltro = document.getElementById("generoFiltro");
const fechaFiltro = document.getElementById("fechaInicioFiltro");
const btnFiltrar = document.getElementById("btnFiltrar");

// Modal (detalle del cuidador)
const modalEl = document.getElementById("carerDetailModal");
const modalTitle = document.getElementById("carerDetailLabel");
const modalSpecialty = document.getElementById("carerSpecialtyBadge");
const modalExperience = document.getElementById("carerExperience");
const modalAvailability = document.getElementById("carerAvailability");
const modalRate = document.getElementById("carerRate");
const modalContact = document.getElementById("carerContact");
const modalNotes = document.getElementById("carerNotes");
const modalSelectBtn = document.getElementById("carerSelectBtn");

/******************************************************
 *  VARIABLES GLOBALES
 ******************************************************/
let carers = [];
let storedRequest = null;

/******************************************************
 *  EVENTO PRINCIPAL - DOM cargado
 ******************************************************/
document.addEventListener("DOMContentLoaded", () => {
  storedRequest = loadStoredRequest();
  loadCarers();

  btnFiltrar?.addEventListener("click", (e) => {
    e.preventDefault();
    renderResultados(applyFilters());
  });
});

/******************************************************
 *  Recupera la solicitud almacenada en sessionStorage
 *  para autocompletar filtros.
 ******************************************************/
function loadStoredRequest() {
  const raw = sessionStorage.getItem("lastCareRequest");
  if (!raw) return null;

  try {
    const data = JSON.parse(raw);

    if (fechaFiltro && data.startDate) fechaFiltro.value = data.startDate;
    if (tipoFiltro && data.carerType) tipoFiltro.value = data.carerType;
    if (generoFiltro && data.genderPreference) generoFiltro.value = data.genderPreference;

    return data;
  } catch (err) {
    console.warn("No se pudo leer la solicitud previa:", err);
    return null;
  }
}

/******************************************************
 *  CARGA inicial de cuidadores desde la API
 ******************************************************/
async function loadCarers() {
  showMessage("Cargando cuidadores...");
  carers = await getCarers();
  renderResultados(applyFilters());
}

/******************************************************
 *  Construye objeto de filtros combinando solicitud previa
 *  y filtros actuales del usuario.
 ******************************************************/
function applyFilters() {
  const filters = {
    carerType: (tipoFiltro?.value || storedRequest?.carerType || "").trim(),
    gender: (generoFiltro?.value || storedRequest?.genderPreference || "").trim(),
    startDate: (fechaFiltro?.value || storedRequest?.startDate || "").trim(),
    specialtyIds: storedRequest?.specialtyIds || [],
  };

  return filterCarers(carers, filters);
}

/******************************************************
 *  FILTRADO de cuidadores según criterios de búsqueda
 ******************************************************/
function filterCarers(list = [], filters = {}) {
  const specialtySet = new Set(
    (filters.specialtyIds || [])
      .map(Number)
      .filter((id) => !Number.isNaN(id))
  );

  return list.filter((carer) => {
    if (specialtySet.size && (!carer.specialty || !specialtySet.has(Number(carer.specialty.id)))) {
      return false;
    }

    if (filters.carerType === "Cuidador con estudios" && !carer.specialty) {
      return false;
    }

    if (filters.carerType === "Estudiante") {
      const exp = (carer.experience || "").toLowerCase();
      if (!exp.includes("estudiante")) return false;
    }

    return true;
  });
}

/******************************************************
 *  Renderiza las tarjetas de cuidadores filtrados
 ******************************************************/
function renderResultados(lista = []) {
  resultadosContainer.innerHTML = "";

  if (!lista.length) {
    resultadosContainer.innerHTML =
      '<p class="text-center text-light">No se encontraron cuidadores que coincidan con la solicitud.</p>';
    return;
  }

  lista.forEach((carer, idx) => {
    const fullName =
      `${carer.firstName || ""} ${carer.lastName || ""}`.trim() ||
      "Nombre no disponible";

    const specialty = carer.specialty?.name || "Sin especialidad";
    const experience = carer.experience || "Experiencia no informada";
    const availability = carer.availability || "Disponibilidad no indicada";
    const rate = carer.hourlyRate ? `$${carer.hourlyRate}` : "Tarifa no informada";
    const carerId = carer.id ?? `idx-${idx}`;

    const card = `
      <div class="result-card shadow-sm p-3 mb-3 bg-light rounded">
        <h5 class="fw-bold text-primary">${fullName}</h5>
        <p class="mb-1"><strong>Especialidad:</strong> ${specialty}</p>
        <p class="mb-1"><strong>Experiencia:</strong> ${experience}</p>
        <p class="mb-1"><strong>Disponibilidad:</strong> ${availability}</p>
        <p class="mb-3"><strong>Tarifa por hora:</strong> ${rate}</p>

        <div class="d-flex justify-content-between">
          <button class="btn btn-outline-primary btn-sm" data-action="ver-detalle" data-carer-id="${carerId}">Ver detalle</button>
          <button class="btn btn-success btn-sm" data-action="seleccionar" data-carer-id="${carerId}">Seleccionar</button>
        </div>
      </div>
    `;

    resultadosContainer.insertAdjacentHTML("beforeend", card);
  });

  resultadosContainer.querySelectorAll("[data-action='seleccionar']")
    .forEach((btn) => {
      btn.addEventListener("click", async (event) => {
        const carer = findCarerById(event.currentTarget.dataset.carerId);
        if (carer) {
          await assignCareRequestToCarer(carer, event.currentTarget);
        }
      });
    });

  resultadosContainer.querySelectorAll("[data-action='ver-detalle']")
    .forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const carer = findCarerById(event.currentTarget.dataset.carerId);
        if (carer) openDetailModal(carer);
      });
    });
}

/******************************************************
 *  Muestra un mensaje temporal dentro del contenedor
 ******************************************************/
function showMessage(text) {
  resultadosContainer.innerHTML = `<p class="text-center text-light">${text}</p>`;
}

/******************************************************
 *  Busca un cuidador por ID (o índice fallback)
 ******************************************************/
function findCarerById(id) {
  return carers.find(
    (c) =>
      String(c.id ?? "") === String(id) ||
      `idx-${carers.indexOf(c)}` === String(id)
  );
}

/******************************************************
 *  Asigna la solicitud más reciente del usuario al cuidador elegido
 ******************************************************/
async function assignCareRequestToCarer(carer, triggerButton) {
  const userId = getCurrentUserId();
  if (!userId) {
    showMessage("No pudimos identificar al usuario. Inicia sesión nuevamente.");
    return;
  }

  if (triggerButton) {
    triggerButton.disabled = true;
    triggerButton.textContent = "Asignando...";
  }

  try {
    const request = await findLatestUserRequestWithoutCarer(userId);
    if (!request) {
      showMessage("No encontramos una solicitud pendiente para asignar.");
      return;
    }

    const payload = {
      startDate: request.startDate,
      endDate: request.endDate,
      startTime: request.startTime,
      endTime: request.endTime,
      specialtyIds: request.specialtyIds || [],
      carerType: request.carerType,
      genderPreference: request.genderPreference,
      emergencyPhone: request.emergencyPhone,
      diseases: request.diseases || [],
      medications: request.medications || [],
      allergies: request.allergies || [],
      conditions: request.conditions || [],
      status: request.status || "PENDING",
      userId: request.requesterId || request.userId,
      carerId: carer.id,
      patientInfoId: request.patientInfo?.id ?? request.patientInfoId ?? null,
      paymentInfoId: request.paymentInfo?.id ?? request.paymentInfoId ?? null,
    };

    await updateCareRequest(request.id, payload);
    sessionStorage.setItem("selectedCarerId", String(carer.id));
    window.location.href = "PaymentAndInsurance.html";
  } catch (error) {
    console.error("No se pudo asignar el cuidador:", error);
    showMessage("No se pudo asignar el cuidador. Intenta nuevamente.");
  } finally {
    if (triggerButton) {
      triggerButton.disabled = false;
      triggerButton.textContent = "Seleccionar";
    }
  }
}

async function findLatestUserRequestWithoutCarer(userId) {
  const requests = await getAllCareRequests();
  return (requests || [])
    .filter((req) => {
      const requesterId = Number(req.requesterId) || Number(req.userId);
      return requesterId === userId && !req.carerId;
    })
    .sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0))
    .at(0);
}

function getCurrentUserId() {
  const id = Number(localStorage.getItem("userId"));
  return Number.isNaN(id) ? null : id;
}

/******************************************************
 *  Abre modal con datos completos del cuidador
 ******************************************************/
function openDetailModal(carer) {
  if (!modalEl) return;

  if (modalTitle) modalTitle.textContent = "Cargando datos...";
  if (modalContact) modalContact.textContent = "Buscando contacto...";

  const fullName =
    `${carer.firstName || ""} ${carer.lastName || ""}`.trim() ||
    "Nombre no disponible";

  const specialty = carer.specialty?.name || "Sin especialidad";
  const experience = carer.experience || "Experiencia no informada";
  const availability = carer.availability || "Disponibilidad no indicada";
  const rate = carer.hourlyRate ? `$${carer.hourlyRate}` : "Tarifa no informada";
  const contact =
    carer.phoneNumber ||
    carer.phone ||
    carer.contact ||
    carer.email ||
    "No informado";
  const notes = carer.description || carer.notes || experience;

  if (modalTitle) modalTitle.textContent = fullName;
  if (modalSpecialty) modalSpecialty.textContent = specialty;
  if (modalExperience) modalExperience.textContent = experience;
  if (modalAvailability) modalAvailability.textContent = availability;
  if (modalRate) modalRate.textContent = rate;
  if (modalContact) modalContact.textContent = contact;
  if (modalNotes) modalNotes.textContent = notes;

  if (modalSelectBtn) {
    modalSelectBtn.onclick = () => assignCareRequestToCarer(carer, modalSelectBtn);
  }

  const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
  modalInstance.show();
}
