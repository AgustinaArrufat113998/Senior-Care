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
    const payload = decodeJwtPayload(token);
    // Ajustá estas claves a tu JwtTokenUtil si usás otro claim
    const idFromJwt = payload?.id || payload?.userId;
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
    btn.dataset.id = skill.id;       // <- ID numérico para el POST
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

  // Debe estar logueado
  const userId = resolveUserId();
  if (!userId) {
    window.Swal ? Swal.fire({
      icon: "warning",
      title: "Inicio de sesión requerido",
      text: "Debes iniciar sesión para registrarte como cuidador."
    }) : alert("Debes iniciar sesión para registrarte como cuidador.");
    return;
  }

  const specialtyId = Number(specialtySelect.value);
  const experience = experienciaSelect.value;
  const availability = disponibilidadSelect.value;
  const hourlyRate = Number(document.getElementById("tarifa").value);
  const otraSkillTexto = otraSkillInput.value.trim();

  // NOTA: el backend espera IDs en skillIds.
  // Mantengo 'otra' visible pero NO la mando en skillIds (no hay endpoint para crear skill).
  // Cuando tengas POST /api/skill, acá podrías crearla y luego pushear el ID retornado.

  const carerData = {
    userId,                 // ✅ requerido por tu DTO
    experience,             // ✅ string
    availability,           // ✅ string
    hourlyRate,             // ✅ number
    specialtyId,            // ✅ number (id)
    skillIds: selectedSkillIds, // ✅ array de ids numéricos
    newSkills: otraSkillTexto || null 
  };

  try {
    await createCarer(carerData);
    if (window.Swal) {
      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: ("Tu perfil de cuidador ha sido creado correctamente."),
        timer: 3500,
        showConfirmButton: false
      });
    }
    caregiverForm.reset();
    selectedSkillIds = [];
    // Ocultar campo "otra"
    document.getElementById("otraSkillBtn")?.classList.remove("active");
    otraSkillInputContainer.style.display = "none";
  } catch (err) {
    console.error(err);
    if (window.Swal) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al guardar los datos. Revisá los campos e intentá nuevamente."
      });
    }
  }
});
