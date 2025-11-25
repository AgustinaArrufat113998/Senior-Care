import { getCarers } from "../Api/Carer.js";

const resultadosContainer = document.getElementById("resultadosContainer");
const tipoFiltro = document.getElementById("tipoAtencionFiltro");
const generoFiltro = document.getElementById("generoFiltro");
const fechaFiltro = document.getElementById("fechaInicioFiltro");
const btnFiltrar = document.getElementById("btnFiltrar");

let carers = [];
let storedRequest = null;

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

function renderResultados(lista = []) {
  resultadosContainer.innerHTML = "";

  if (!lista.length) {
    resultadosContainer.innerHTML = '<p class="text-center text-light">No se encontraron cuidadores que coincidan con la solicitud.</p>';
    return;
  }

  lista.forEach((carer) => {
    const fullName = `${carer.firstName || ""} ${carer.lastName || ""}`.trim() || "Cuidador";
    const specialty = carer.specialty?.name || "Sin especialidad";
    const experience = carer.experience || "Experiencia no informada";
    const availability = carer.availability || "Disponibilidad no indicada";
    const rate = carer.hourlyRate ? `$${carer.hourlyRate}` : "Tarifa no informada";

    const card = `
      <div class="result-card shadow-sm p-3 mb-3 bg-light rounded">
        <h5 class="fw-bold text-primary">${fullName}</h5>
        <p class="mb-1"><strong>Especialidad:</strong> ${specialty}</p>
        <p class="mb-1"><strong>Experiencia:</strong> ${experience}</p>
        <p class="mb-1"><strong>Disponibilidad:</strong> ${availability}</p>
        <p class="mb-3"><strong>Tarifa por hora:</strong> ${rate}</p>

        <div class="d-flex justify-content-between">
          <button class="btn btn-outline-primary btn-sm" data-action="ver-detalle">Ver detalle</button>
          <button class="btn btn-success btn-sm" data-action="seleccionar">Seleccionar</button>
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
    btn.addEventListener("click", () => {
      alert("Detalle del cuidador en desarrollo.");
    });
  });
}

function showMessage(text) {
  resultadosContainer.innerHTML = `<p class="text-center text-light">${text}</p>`;
}
