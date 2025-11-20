import {
  getAllergies,
  getConditions,
  getDiseases,
  getMedications,
  createCareRequest,
} from "../Api/CareRequest.js";

import { getSpecialties } from "../Api/Carer.js";

const CARER_TYPES_WITH_SPECIALTIES = new Set(["Cuidador con estudios", "Estudiante"]);

const catalogsConfig = [
  {
    buttonId: "enfermedadesDropdown",
    listId: "enfermedadesList",
    loader: getDiseases,
    labelKey: "disease",
    emptyLabel: "enfermedades",
    defaultLabel: "Sin enfermedades",
  },
  {
    buttonId: "medicacionesDropdown",
    listId: "medicacionesList",
    loader: getMedications,
    labelKey: "medication",
    emptyLabel: "medicaciones",
    defaultLabel: "Sin medicaciones",
  },
  {
    buttonId: "alergiasDropdown",
    listId: "alergiasList",
    loader: getAllergies,
    labelKey: "allergy",
    emptyLabel: "alergias",
    defaultLabel: "Sin alergias",
  },
  {
    buttonId: "condicionesDropdown",
    listId: "condicionesList",
    loader: getConditions,
    labelKey: "condition",
    emptyLabel: "condiciones",
    defaultLabel: "Sin condiciones",
  },
];

const form = document.getElementById("careRequestForm");
const messageBox = document.getElementById("msg");
const specialtyContainer = document.getElementById("carrerasContainer");
const specialtyDropdownButton = document.getElementById("carreraDropdown");
const specialtyList = document.getElementById("specialtyDropdownList");
const cuidadosSimplesContainer = document.getElementById("cuidadosSimplesContainer");

let cachedSpecialties = [];

document.addEventListener("DOMContentLoaded", async () => {
  await loadCatalogs();
  setupCarerTypeListeners();
  if (form) {
    form.addEventListener("submit", handleSubmit);
  }
});

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
    showMessage("Ocurrió un problema al cargar los catálogos. Intenta nuevamente.", "error");
  }
}

function renderCatalogList(listElement, items = [], config) {
  const { labelKey, defaultLabel } = config;
  listElement.innerHTML = "";
  items.forEach(item => {
    if (!item?.id) return;
    const labelText = item[labelKey] || item.name || `Opción ${item.id}`;
    const isDefault = defaultLabel
      ? labelText.trim().toLowerCase() === defaultLabel.toLowerCase()
      : false;

    const li = document.createElement("li");
    li.classList.add("mb-1");

    const label = document.createElement("label");
    label.className = "form-check-label d-flex align-items-center gap-2";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "form-check-input catalog-option";
    input.value = item.id;
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

function attachCatalogListBehavior(list, button, config) {
  const updateState = () => {
    const defaultInput = list.querySelector("input[data-default-option='true']");
    const defaultChecked = defaultInput ? defaultInput.checked : false;

    list.querySelectorAll("input[type='checkbox']").forEach(input => {
      if (!defaultInput || input === defaultInput) {
        return;
      }
      if (defaultChecked) {
        input.checked = false;
        input.disabled = true;
      } else {
        input.disabled = false;
      }
    });

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

function updateCatalogButtonLabel(button, selectedCount, emptyLabel, defaultText = null) {
  if (defaultText) {
    button.textContent = `${defaultText}`;
    return;
  }
  button.textContent = selectedCount
    ? `${capitalize(emptyLabel)} seleccionadas (${selectedCount})`
    : `Seleccionar ${emptyLabel}`;
}

function capitalize(text = "") {
  if (!text.length) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function setupCarerTypeListeners() {
  const radios = document.querySelectorAll('input[name="tipoAtencion"]');
  radios.forEach(radio => {
    radio.addEventListener("change", async (event) => {
      const selected = event.target.value;
      toggleCuidadosHint(selected);
      if (CARER_TYPES_WITH_SPECIALTIES.has(selected)) {
        specialtyContainer?.classList.remove("hidden");
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

  specialtyList?.addEventListener("change", updateSpecialtyButtonLabel);
}

function toggleCuidadosHint(carerType) {
  if (!cuidadosSimplesContainer) return;
  if (!carerType || CARER_TYPES_WITH_SPECIALTIES.has(carerType)) {
    cuidadosSimplesContainer.classList.add("hidden");
  } else {
    cuidadosSimplesContainer.classList.remove("hidden");
  }
}

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

function clearSpecialtySelection() {
  specialtyList?.querySelectorAll("input[type='checkbox']").forEach(input => {
    input.checked = false;
  });
  updateSpecialtyButtonLabel();
}

function updateSpecialtyButtonLabel() {
  if (!specialtyDropdownButton) return;
  const selected = getSelectedSpecialtyIds();
  specialtyDropdownButton.textContent = selected.length
    ? `Especialidades seleccionadas (${selected.length})`
    : "Seleccionar especialidades";
}

function getSelectedSpecialtyIds() {
  if (!specialtyList) return [];
  return Array.from(specialtyList.querySelectorAll("input[type='checkbox']:checked"))
    .map(input => Number(input.value))
    .filter(id => !Number.isNaN(id));
}

async function handleSubmit(event) {
  event.preventDefault();
  showMessage("");

  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? Number(storedUserId) : null;
  if (!userId) {
    showMessage("Debes iniciar sesión para crear una solicitud.", "error");
    return;
  }

  const selectedCarerType = document.querySelector('input[name="tipoAtencion"]:checked')?.value || null;
  if (CARER_TYPES_WITH_SPECIALTIES.has(selectedCarerType) && !getSelectedSpecialtyIds().length) {
    showMessage("Seleccioná al menos una especialidad.", "error");
    return;
  }

  try {
    const payload = buildRequestPayload(userId);
    await createCareRequest(payload);
    showMessage("Solicitud enviada con éxito.", "success");
    form.reset();
    clearSpecialtySelection();
    specialtyContainer?.classList.add("hidden");
    setTimeout(() => {
      window.location.href = "CareRequestResults.html";
    }, 1200);
  } catch (error) {
    console.error("Error al crear la solicitud:", error);
    showMessage(error.message || "No se pudo crear la solicitud de cuidado.", "error");
  }
}

function buildRequestPayload(userId) {
  const carerType = document.querySelector('input[name="tipoAtencion"]:checked')?.value || null;
  const specialtyIds = getSelectedSpecialtyIds();

  return {
    startDate: document.getElementById("fechaInicio")?.value || null,
    endDate: document.getElementById("fechaFin")?.value || null,
    startTime: document.getElementById("horaInicio")?.value || null,
    endTime: document.getElementById("horaFin")?.value || null,
    specialtyIds,
    carerType,
    genderPreference: document.getElementById("preferenciaGenero")?.value || "",
    emergencyPhone: document.getElementById("telefonoEmergencia")?.value || "",
    status: "PENDING",
    userId,
    carerId: null,
    patientInfoId: null,
    paymentInfoId: null,
  };
}

function showMessage(text, type = "info") {
  if (!messageBox) return;
  messageBox.textContent = text;
  messageBox.className = type === "error" ? "error" : type === "success" ? "success" : "";
}
