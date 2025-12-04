// =============================
// 📌 IMPORTS DE APIS
// =============================
import {
  getAllergies,
  getConditions,
  getDiseases,
  getMedications,
  createCareRequest,
} from "../Api/CareRequest.js";

import { getSpecialties } from "../Api/Carer.js";


// =============================
// 📌 TIPOS DE CUIDADOR QUE REQUIEREN ESPECIALIDADES
// =============================
const CARER_TYPES_WITH_SPECIALTIES = new Set([
  "Cuidador con estudios",
  "Profesional",
  "Estudiante",
]);


// =============================
// 📌 CONFIGURACIÓN DE CATÁLOGOS MÉDICOS
// (enfermedades, medicaciones, alergias, condiciones)
// =============================
const catalogsConfig = [
  // --- Enfermedades ---
  {
    buttonId: "enfermedadesDropdown",
    listId: "enfermedadesList",
    loader: getDiseases,
    labelKey: "disease",
    emptyLabel: "enfermedades",
    defaultLabel: "Sin enfermedades",
  },
  // --- Medicaciones ---
  {
    buttonId: "medicacionesDropdown",
    listId: "medicacionesList",
    loader: getMedications,
    labelKey: "medication",
    emptyLabel: "medicaciones",
    defaultLabel: "Sin medicaciones",
  },
  // --- Alergias ---
  {
    buttonId: "alergiasDropdown",
    listId: "alergiasList",
    loader: getAllergies,
    labelKey: "allergy",
    emptyLabel: "alergias",
    defaultLabel: "Sin alergias",
  },
  // --- Condiciones médicas ---
  {
    buttonId: "condicionesDropdown",
    listId: "condicionesList",
    loader: getConditions,
    labelKey: "condition",
    emptyLabel: "condiciones",
    defaultLabel: "Sin condiciones",
  },
];


// =============================
// 📌 REFERENCIAS A ELEMENTOS DEL FORMULARIO
// =============================
const form = document.getElementById("careRequestForm");
const messageBox = document.getElementById("msg");

// 📌 Fecha y hora
const startDateInput = document.getElementById("fechaInicio");
const endDateInput = document.getElementById("fechaFin");
const startTimeInput = document.getElementById("horaInicio");
const endTimeInput = document.getElementById("horaFin");

// 📌 Especialidades
const specialtyContainer = document.getElementById("carrerasContainer");
const specialtyDropdownButton = document.getElementById("carreraDropdown");
const specialtyList = document.getElementById("specialtyDropdownList");

// 📌 Cuidados simples (solo para cuidadores sin estudios)
const cuidadosSimplesContainer = document.getElementById("cuidadosSimplesContainer");

let cachedSpecialties = [];


// =============================
// 📌 Determina si un tipo de cuidador requiere especialidades
// =============================
function carerTypeRequiresSpecialties(radio) {
  if (!radio) return false;

  // ✔ Soporta sistema nuevo con data-attributes
  if (radio.dataset?.requiresSpecialties === "true") return true;

  // ✔ Soporta sistema previo basado en el texto del value
  return CARER_TYPES_WITH_SPECIALTIES.has(radio.value);
}


// =============================
// 📌 EVENTO PRINCIPAL – Al cargar la página
// =============================
document.addEventListener("DOMContentLoaded", async () => {

  // --- FECHAS Y HORAS ---
  setupDateTimeConstraints();

  // --- CARGA DE CATÁLOGOS MÉDICOS ---
  await loadCatalogs();

  // --- TIPO DE CUIDADOR ---
  setupCarerTypeListeners();

  // --- SUBMIT ---
  if (form) {
    form.addEventListener("submit", handleSubmit);
  }
});


// =============================
// 📌 CONFIGURACIONES DE FECHA Y HORA
// =============================
function setupDateTimeConstraints() {
  const today = getTodayString();

  initTimePickers();

  // Fecha mínima = hoy (no se puede elegir pasado)
  if (startDateInput) {
    startDateInput.min = today;
    endDateInput.min = today;

    // Cuando cambia fecha de inicio
    startDateInput.addEventListener("change", () => {
      const startDate = startDateInput.value;

      // Ajusto fecha mínima de fin
      endDateInput.min = startDate || today;

      // Si selecciona hoy → hora mínima es hora actual redondeada
      if (startDate === today) {
        startTimeInput.min = getRoundedCurrentTime();
      } else {
        startTimeInput.min = "";
      }

      validarHoras();
    });
  }

  // Sincronizar horas al cambiar hora inicio
  if (startTimeInput) {
    startTimeInput.addEventListener("change", validarHoras);
  }

  // Sincronizar horas al cambiar hora fin
  if (endTimeInput) {
    endTimeInput.addEventListener("change", validarHoras);
  }

  // Sincronizar fecha fin
  if (endDateInput) {
    endDateInput.addEventListener("change", validarHoras);
  }
}

// =============================
// ⏱️ VALIDADOR DE HORARIOS
// =============================
function validarHoras() {
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;
  const startTime = startTimeInput.value;
  const endTime = endTimeInput.value;

  // Solo validar si todo está presente
  if (!startDate || !endDate || !startTime || !endTime) return;

  // Caso: fecha inicio = fecha fin
  if (startDate === endDate) {
    if (startTime > endTime) {
      Swal.fire({
        icon: "warning",
        title: "Horario inválido",
        text: "La hora de inicio no puede ser mayor a la hora de fin cuando la fecha es el mismo día.",
        confirmButtonColor: "#3085d6",
      });

      // Limpiamos el tiempo final
      endTimeInput.value = "";
    }
  }
}

// =============================
// 🕒 Redondear hora actual a múltiplos de 5
// =============================
function getRoundedCurrentTime() {
  const now = new Date();
  let minutes = now.getMinutes();

  minutes = Math.ceil(minutes / 5) * 5;

  if (minutes === 60) {
    now.setHours(now.getHours() + 1);
    minutes = 0;
  }

  return `${String(now.getHours()).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}



// =============================
// 📌 Obtener fecha actual (YYYY-MM-DD)
// =============================
function getTodayString() {
  return new Date().toISOString().split("T")[0];
}


// =============================
// 📌 CARGA DE CATÁLOGOS MÉDICOS
// (enfermedades, medicaciones, alergias, condiciones)
// =============================
async function loadCatalogs() {
  try {
    await Promise.all(
      catalogsConfig.map(async (config) => {
        const { buttonId, listId, loader, emptyLabel } = config;

        const button = document.getElementById(buttonId);
        const list = document.getElementById(listId);
        if (!button || !list) return;

        list.innerHTML = `<li class="text-center text-muted py-1">Cargando...</li>`;

        try {
          const data = await loader();
          renderCatalogList(list, data, config);
          attachCatalogListBehavior(list, button, config);

        } catch (error) {
          console.error(`Error al cargar ${emptyLabel}:`, error);
          list.innerHTML = `<li class="text-danger px-2">Sin datos</li>`;
          showMessage(`No pudimos obtener ${emptyLabel}.`, "error");
        }
      })
    );
  } catch (catError) {
    console.error("Error al cargar catálogos:", catError);
    showMessage("Ocurrió un problema al cargar los catálogos.", "error");
  }
}


// =============================
// 📌 Renderiza cada lista de catálogo
// =============================
function renderCatalogList(listElement, items = [], config) {
  const { labelKey, defaultLabel } = config;

  listElement.innerHTML = "";

  items.forEach(item => {
    if (!item?.id) return;

    const labelText =
      item[labelKey] || item.name || `Opción ${item.id}`;

    const isDefault =
      defaultLabel &&
      labelText.trim().toLowerCase() === defaultLabel.toLowerCase();

    // Crear fila
    const li = document.createElement("li");
    li.classList.add("mb-1");

    const label = document.createElement("label");
    label.className = "form-check-label d-flex align-items-center gap-2";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "form-check-input catalog-option";
    input.value = item.id;
    input.dataset.listId = listElement.id;

    // Marca opciones predeterminadas como "Sin X"
    if (isDefault) {
      input.dataset.defaultOption = "true";
      input.checked = true;
    }

    const span = document.createElement("span");
    span.textContent = labelText;

    label.appendChild(input);
    label.appendChild(span);
    li.appendChild(label);

    listElement.appendChild(li);
  });
}


// =============================
// 📌 Comportamiento de cada lista de catálogo
// =============================
function attachCatalogListBehavior(list, button, config) {

  const updateState = () => {
    const defaultInput = list.querySelector("input[data-default-option='true']");
    const defaultChecked = defaultInput?.checked;

    // Si está marcada "Sin ___", se deshabilitan las demás
    list.querySelectorAll("input[type='checkbox']").forEach(input => {
      if (!defaultInput || input === defaultInput) return;
      input.disabled = defaultChecked;
      if (defaultChecked) input.checked = false;
    });

    // Cambia el texto del botón
    const selectedCount = defaultChecked
      ? 1
      : list.querySelectorAll("input[type='checkbox']:checked").length;

    updateCatalogButtonLabel(
      button,
      selectedCount,
      config.emptyLabel,
      defaultChecked ? config.defaultLabel : null
    );
  };

  list.addEventListener("change", updateState);
  updateState();
}


// =============================
// 📌 Cambia texto del botón de catálogo
// =============================
function updateCatalogButtonLabel(button, selectedCount, emptyLabel, defaultText = null) {
  if (defaultText) {
    button.textContent = `${defaultText}`;
    return;
  }

  button.textContent = selectedCount
    ? `${capitalize(emptyLabel)} seleccionadas (${selectedCount})`
    : `Seleccionar ${emptyLabel}`;
}


// =============================
// 📌 Utilidad para capitalizar texto
// =============================
function capitalize(text = "") {
  return text.length ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}


// =============================
// 📌 LOGICA DE TIPOS DE CUIDADOR
// (qué radios mostrar y cuándo pedir especialidades)
// =============================
function setupCarerTypeListeners() {
  const radios = document.querySelectorAll('input[name="tipoAtencion"]');

  radios.forEach(radio => {
    radio.addEventListener("change", async (event) => {
      const selectedRadio = event.target;

      const needsSpecialties = carerTypeRequiresSpecialties(selectedRadio);

      // Mostrar/ocultar "Cuidados simples"
      toggleCuidadosHint(needsSpecialties);

      // Si requiere especialidades:
      if (needsSpecialties) {
        specialtyContainer?.classList.remove("hidden");

        // Cargar especialidades solo una vez
        if (!cachedSpecialties.length) {
          try {
            cachedSpecialties = await getSpecialties();
          } catch (error) {
            console.error("Error al obtener especialidades:", error);
            showMessage("No se pudieron cargar las especialidades.", "error");
          }
        }

        renderSpecialtyCheckboxes(cachedSpecialties);
      } else {
        specialtyContainer?.classList.add("hidden");
        clearSpecialtySelection();
      }
    });
  });

  // Cambiar texto del dropdown de especialidades
  specialtyList?.addEventListener("change", updateSpecialtyButtonLabel);

  // Si ya hay algo seleccionado al cargar la página
  const preselected = document.querySelector('input[name="tipoAtencion"]:checked');
  if (preselected) preselected.dispatchEvent(new Event("change"));
}


// =============================
// 📌 Mostrar u ocultar "Cuidados simples"
// =============================
function toggleCuidadosHint(requiresSpecialties) {
  if (!cuidadosSimplesContainer) return;
  if (requiresSpecialties) cuidadosSimplesContainer.classList.add("hidden");
  else cuidadosSimplesContainer.classList.remove("hidden");
}


// =============================
// 📌 Renderiza especialidades
// =============================
function renderSpecialtyCheckboxes(specialties = []) {
  if (!specialtyList) return;
  specialtyList.innerHTML = "";

  specialties.forEach(spec => {
    if (!spec?.id) return;

    const li = document.createElement("li");
    li.classList.add("mb-1");

    li.innerHTML = `
      <label class="form-check-label d-flex align-items-center gap-2">
        <input class="form-check-input specialty-option" type="checkbox" value="${spec.id}">
        <span>${spec.name || "Especialidad"}</span>
      </label>
    `;

    specialtyList.appendChild(li);
  });

  updateSpecialtyButtonLabel();
}


// =============================
// 📌 Limpia especialidades
// =============================
function clearSpecialtySelection() {
  specialtyList?.querySelectorAll("input[type='checkbox']").forEach(i => {
    i.checked = false;
  });
  updateSpecialtyButtonLabel();
}


// =============================
// 📌 Cambia botón de especialidades
// =============================
function updateSpecialtyButtonLabel() {
  if (!specialtyDropdownButton) return;

  const selected = getSelectedSpecialtyIds();

  specialtyDropdownButton.textContent =
    selected.length
      ? `Especialidades seleccionadas (${selected.length})`
      : "Seleccionar especialidades";
}


// =============================
// 📌 Obtiene IDs de especialidades seleccionadas
// =============================
function getSelectedSpecialtyIds() {
  if (!specialtyList) return [];

  return Array.from(
    specialtyList.querySelectorAll("input[type='checkbox']:checked")
  )
    .map(input => Number(input.value))
    .filter(id => !Number.isNaN(id));
}


// =============================
// 📌 SUBMIT DEL FORMULARIO
// =============================
async function handleSubmit(event) {
  event.preventDefault();
  showMessage("");

  // ✔ Validación de fecha y hora
  if (!validateDateTime()) {
    alert("Problema de validación de fecha/hora");
    return;
  }

  // ✔ Usuario logueado
  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? Number(storedUserId) : null;
  if (!userId) {
    showMessage("Debes iniciar sesión para crear una solicitud.", "error");
    return;
  }

  // ✔ Validación del tipo de cuidador
  const selectedCarerRadio = document.querySelector('input[name="tipoAtencion"]:checked');
  if (carerTypeRequiresSpecialties(selectedCarerRadio) && !getSelectedSpecialtyIds().length) {
    showMessage("Selecciona al menos una especialidad.", "error");
    return;
  }

  // ✔ Construcción del payload
  try {
    const payload = buildRequestPayload(userId);
    await createCareRequest(payload);

    sessionStorage.setItem("lastCareRequest", JSON.stringify(payload));

    showMessage("Solicitud enviada con éxito.", "success");
    window.location.href = "CareRequestResults.html";

  } catch (error) {
    console.error("Error al crear la solicitud:", error);
    showMessage(error.message || "No se pudo crear la solicitud de cuidado.", "error");
  }
}


// =============================
// 📌 Construcción del payload final
// =============================
function buildRequestPayload(userId) {
  const carerType = document.querySelector('input[name="tipoAtencion"]:checked')?.value || null;

  return {
    // --- FECHA Y HORA ---
    startDate: document.getElementById("fechaInicio")?.value || null,
    endDate: document.getElementById("fechaFin")?.value || null,
    startTime: document.getElementById("horaInicio")?.value || null,
    endTime: document.getElementById("horaFin")?.value || null,

    // --- ESPECIALIDADES ---
    specialtyIds: getSelectedSpecialtyIds(),

    // --- TIPO DE CUIDADOR ---
    carerType,

    // --- SEXO PREFERIDO (cuidador hombre/mujer/indistinto) ---
    genderPreference: document.getElementById("preferenciaGenero")?.value || "",

    // --- TELÉFONO DE EMERGENCIA ---
    emergencyPhone: document.getElementById("telefonoEmergencia")?.value || "",

    // --- CATÁLOGOS MÉDICOS ---
    diseases: collectCatalogSelection("enfermedadesList"),
    medications: collectCatalogSelection("medicacionesList"),
    allergies: collectCatalogSelection("alergiasList"),
    conditions: collectCatalogSelection("condicionesList"),

    // --- DATOS SISTEMA ---
    status: "PENDING",
    userId,
    carerId: null,
    patientInfoId: null,
    paymentInfoId: null,
  };
}


// =============================
// 📌 Obtiene IDs seleccionados de cualquier catálogo
// =============================
function collectCatalogSelection(listId) {
  const list = document.getElementById(listId);
  if (!list) return [];

  const defaultChecked = list.querySelector("input[data-default-option='true']:checked");
  if (defaultChecked) return [];

  return Array.from(list.querySelectorAll("input[type='checkbox']:checked"))
    .map(input => Number(input.value))
    .filter(val => !Number.isNaN(val));
}


// =============================
// 📌 Mostrar mensajes de error/info
// =============================
function showMessage(text, type = "info") {
  if (!messageBox) return;
  messageBox.textContent = text;
  messageBox.className =
    type === "error"
      ? "error"
      : type === "success"
      ? "success"
      : "";
}


// =============================
// 📌 Validaciones de fecha/hora
// =============================
function validateDateTime() {
  const startDate = startDateInput?.value || "";
  const endDate = endDateInput?.value || "";
  const startTime = startTimeInput?.value || "";
  const endTime = endTimeInput?.value || "";
  const today = getTodayString();

  const nowRounded = getRoundedCurrentTime();

  // 1️⃣ Fecha inicio no puede ser anterior a hoy
  if (startDate < today) {
    showMessage("La fecha de inicio no puede ser anterior a hoy.", "error");
    return false;
  }

  // 2️⃣ Si la fecha es hoy → hora inicio no puede ser anterior a la actual
  if (startDate === today && startTime < nowRounded) {
    showMessage(`La hora de inicio no puede ser anterior a la hora actual (${nowRounded}).`, "error");
    return false;
  }

  // 3️⃣ Fecha fin no puede ser anterior a inicio
  if (startDate && endDate && endDate < startDate) {
    showMessage("La fecha de finalización no puede ser anterior a la de inicio.", "error");
    return false;
  }

  // 4️⃣ Si fecha inicio == fin → hora fin ≥ hora inicio
  if (startDate === endDate && startTime && endTime && endTime < startTime) {
    showMessage("La hora de finalización debe ser posterior o igual a la de inicio.", "error");
    return false;
  }

  return true;
}

function initTimePickers() {
  if (!window.flatpickr) return;
  const config = {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
    minuteIncrement: 5,
    allowInput: true,
    clickOpens: true,
    disableMobile: false,
  };
  document.querySelectorAll(".time-picker").forEach((input) => {
    flatpickr(input, config);
  });
}

