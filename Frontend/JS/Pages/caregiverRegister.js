// === Js/Pages/CaregiverRegister.js ===
import { getSpecialties, getSkills, createCarer } from "../Api/Carer.js";

// --- refs DOM
const specialtySelect = document.getElementById("estudios");
const experienciaSelect = document.getElementById("experiencia");
const disponibilidadSelect = document.getElementById("disponibilidad");
const skillsContainer = document.querySelector(".skills-container");
const otraSkillInputContainer = document.getElementById("otraSkillInputContainer");
const otraSkillInput = document.getElementById("otraSkillInput");
const caregiverForm = document.getElementById("caregiverForm");

// === util: decodifica JWT (sin validar firma, solo para leer payload)
function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

// === obtiene userId desde JWT o localStorage
function resolveUserId() {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    console.log("Token JWT encontrado en localStorage.");
    const payload = decodeJwtPayload(token);
    console.log("Payload decodificado:", payload);
    const idFromJwt = payload?.id || payload?.userId;
    console.log("ID extraído del JWT:", idFromJwt);
    if (idFromJwt) return Number(idFromJwt);
  }
  const user = JSON.parse(localStorage.getItem("userData") || "null");
  if (user?.id) return Number(user.id);
  return null;
}

// === 1) carga inicial
window.addEventListener("DOMContentLoaded", async () => {
  await loadSpecialties();
  await loadSkills();
  loadExperiencia();
  loadDisponibilidad();
});

async function loadSpecialties() {
  const specialties = await getSpecialties();
  specialties.forEach(s => {
    const option = document.createElement("option");
    option.value = s.id;
    option.textContent = s.name;
    specialtySelect.appendChild(option);
  });
}

async function loadSkills() {
  const skills = await getSkills();

  skills.forEach(skill => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "skill-btn";
    btn.dataset.id = skill.id;
    btn.textContent = skill.name;
    skillsContainer.appendChild(btn);
  });

  // Botón "Otra"
  const otraBtn = document.createElement("button");
  otraBtn.type = "button";
  otraBtn.className = "skill-btn";
  otraBtn.id = "otraSkillBtn";
  otraBtn.textContent = "Otra";
  skillsContainer.appendChild(otraBtn);

  setupSkillSelection();
}

function loadExperiencia() {
  const opciones = ["Sin experiencia", "1 año", "2 años", "3 años o más"];
  opciones.forEach(op => {
    const option = document.createElement("option");
    option.value = op;
    option.textContent = op;
    experienciaSelect.appendChild(option);
  });
}

function loadDisponibilidad() {
  const opciones = ["Mañana", "Tarde", "Noche", "Fines de semana", "Todos los días"];
  opciones.forEach(op => {
    const option = document.createElement("option");
    option.value = op;
    option.textContent = op;
    disponibilidadSelect.appendChild(option);
  });
}

// === 2) selección de habilidades
let selectedSkillIds = [];

function setupSkillSelection() {
  const skillButtons = document.querySelectorAll(".skill-btn");
  const otraSkillBtn = document.getElementById("otraSkillBtn");

  skillButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn === otraSkillBtn) {
        btn.classList.toggle("active");
        const active = btn.classList.contains("active");
        otraSkillInputContainer.style.display = active ? "block" : "none";
        if (!active) otraSkillInput.value = "";
        return;
      }

      btn.classList.toggle("active");
      const id = Number(btn.dataset.id);

      if (btn.classList.contains("active")) {
        if (!selectedSkillIds.includes(id)) selectedSkillIds.push(id);
      } else {
        selectedSkillIds = selectedSkillIds.filter(sid => sid !== id);
      }
    });
  });
}

// === 3) submit
caregiverForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userId = resolveUserId();
  if (!userId) {
    Swal.fire({
      icon: "warning",
      title: "Inicio de sesión requerido",
      text: "Debes iniciar sesión para registrarte como cuidador."
    });
    return;
  }

  const specialtyId = Number(specialtySelect.value);
  const experience = experienciaSelect.value;
  const availability = disponibilidadSelect.value;
  const hourlyRate = Number(document.getElementById("tarifa").value);
  const otraSkillTexto = otraSkillInput.value.trim();

  // Validaciones básicas
  if (!specialtyId || isNaN(specialtyId)) {
    Swal.fire({
      icon: "warning",
      title: "Selecciona una especialidad válida"
    });
    return;
  }

  if (!hourlyRate || hourlyRate <= 0) {
    Swal.fire({
      icon: "warning",
      title: "Tarifa inválida",
      text: "Por favor ingresa una tarifa por hora válida."
    });
    return;
  }

  if (selectedSkillIds.length === 0 && !otraSkillTexto) {
    Swal.fire({
      icon: "warning",
      title: "Selecciona al menos una habilidad"
    });
    return;
  }

  // Armado del objeto final
  const carerData = {
    userId,
    experience,
    availability,
    hourlyRate,
    specialtyId,
    skillIds: selectedSkillIds,
    newSkills: otraSkillTexto || null  // ✅ se envía directo al backend
  };

  try {
    const response = await createCarer(carerData);
    const data = await response.json().catch(() => null);

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Registro exitoso 🎉",
        text: "Tu perfil de cuidador ha sido creado correctamente.",
        timer: 3000,
        showConfirmButton: false
      });

      caregiverForm.reset();
      selectedSkillIds = [];
      document.querySelectorAll(".skill-btn.active").forEach(b => b.classList.remove("active"));
      otraSkillInputContainer.style.display = "none";
    } else {
      console.error("Error del backend:", data);
      Swal.fire({
        icon: "error",
        title: "Error al registrar cuidador",
        text: data?.message || "Ocurrió un problema al guardar los datos."
      });
    }

  } catch (err) {
    console.error("Error en registro:", err);
    Swal.fire({
      icon: "error",
      title: "Error inesperado",
      text: err.message || "No se pudo completar la operación."
    });
  }
});
