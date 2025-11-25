import { getCarers } from "../Api/Carer.js";
import { getUserById } from "../Api/userApi.js";

const resultadosContainer = document.getElementById("resultadosContainer");
const tipoFiltro = document.getElementById("tipoAtencionFiltro");
const generoFiltro = document.getElementById("generoFiltro");
const fechaFiltro = document.getElementById("fechaInicioFiltro");
const btnFiltrar = document.getElementById("btnFiltrar");

const modalEl = document.getElementById("carerDetailModal");
const modalTitle = document.getElementById("carerDetailLabel");
const modalSpecialty = document.getElementById("carerSpecialtyBadge");
const modalExperience = document.getElementById("carerExperience");
const modalAvailability = document.getElementById("carerAvailability");
const modalRate = document.getElementById("carerRate");
const modalContact = document.getElementById("carerContact");
const modalNotes = document.getElementById("carerNotes");
const modalSelectBtn = document.getElementById("carerSelectBtn");

let carers = [];
let storedRequest = null;
const userCache = new Map();

document.addEventListener("DOMContentLoaded", () => {
  storedRequest = loadStoredRequest();
  loadCarers();
  btnFiltrar?.addEventListener("click", (e) => {
    e.preventDefault();
    renderResultados(applyFilters());
  });
});

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

async function loadCarers() {
  showMessage("Cargando cuidadores...");
  carers = await getCarers();
  await hydrateUsers(carers);
  renderResultados(applyFilters());
}

function applyFilters() {
  const filters = {
    carerType: (tipoFiltro?.value || storedRequest?.carerType || "").trim(),
    gender: (generoFiltro?.value || storedRequest?.genderPreference || "").trim(),
    startDate: (fechaFiltro?.value || storedRequest?.startDate || "").trim(),
    specialtyIds: storedRequest?.specialtyIds || [],
  };
  return filterCarers(carers, filters);
}

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

    // No filtramos por genero ni fecha porque el backend no provee esos datos
    return true;
  });
}

async function hydrateUsers(list = []) {
  const ids = [...new Set(list.map((c) => c.userId).filter(Boolean))];
  await Promise.all(
    ids.map(async (id) => {
      if (userCache.has(id)) return;
      const user = await getUserById(id);
      if (user) userCache.set(id, user);
    })
  );
}

function renderResultados(lista = []) {
  resultadosContainer.innerHTML = "";

  if (!lista.length) {
    resultadosContainer.innerHTML = '<p class="text-center text-light">No se encontraron cuidadores que coincidan con la solicitud.</p>';
    return;
  }

  lista.forEach((carer, idx) => {
    const user = carer.userId ? userCache.get(carer.userId) : null;
    const fullName =
      (user ? `${user.name || ""} ${user.lastName || ""}`.trim() : "") ||
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

  resultadosContainer.querySelectorAll("[data-action='seleccionar']").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = "PaymentAndInsurance.html";
    });
  });

  resultadosContainer.querySelectorAll("[data-action='ver-detalle']").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const carer = findCarerById(event.currentTarget.dataset.carerId);
      if (carer) openDetailModal(carer);
    });
  });
}

function showMessage(text) {
  resultadosContainer.innerHTML = `<p class="text-center text-light">${text}</p>`;
}

function findCarerById(id) {
  return carers.find((c) => String(c.id ?? "") === String(id) || `idx-${carers.indexOf(c)}` === String(id));
}

async function openDetailModal(carer) {
  if (!modalEl) return;

  // fallback mientras se obtiene el usuario
  if (modalTitle) modalTitle.textContent = "Cargando datos...";
  if (modalContact) modalContact.textContent = "Buscando contacto...";

  let user = carer.userId ? userCache.get(carer.userId) : null;
  if (!user && carer.userId) {
    user = await getUserById(carer.userId);
    if (user) userCache.set(carer.userId, user);
  }

  const fullName =
    (user ? `${user.name || ""} ${user.lastName || ""}`.trim() : "") ||
    `${carer.firstName || ""} ${carer.lastName || ""}`.trim() ||
    "Nombre no disponible";
  const specialty = carer.specialty?.name || "Sin especialidad";
  const experience = carer.experience || "Experiencia no informada";
  const availability = carer.availability || "Disponibilidad no indicada";
  const rate = carer.hourlyRate ? `$${carer.hourlyRate}` : "Tarifa no informada";
  const contact =
    user?.phoneNumber ||
    user?.phone ||
    user?.telefono ||
    user?.email ||
    carer.phoneNumber ||
    carer.phone ||
    carer.contact ||
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
    modalSelectBtn.onclick = () => {
      window.location.href = "PaymentAndInsurance.html";
    };
  }

  const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
  modalInstance.show();
}
