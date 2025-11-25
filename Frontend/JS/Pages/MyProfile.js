const selectors = {
  name: document.getElementById("profileName"),
  role: document.getElementById("rolePill"),
  location: document.getElementById("locationPill"),
  headline: document.getElementById("profileHeadline"),
  email: document.getElementById("contactEmail"),
  phone: document.getElementById("contactPhone"),
  altContact: document.getElementById("contactAlt"),
  focusTags: document.getElementById("focusTags"),
  preferenceTags: document.getElementById("preferenceTags"),
  specialtyTags: document.getElementById("specialtyTags"),
  statsGrid: document.getElementById("statsGrid"),
  familyList: document.getElementById("familyList"),
  requestList: document.getElementById("requestList"),
  serviceList: document.getElementById("serviceList"),
  availabilityList: document.getElementById("availabilityList"),
  documentList: document.getElementById("documentList"),
};

const profiles = {
  user: {
    name: "Ana Rodriguez",
    roleLabel: "Usuario",
    location: "Cordoba, Argentina",
    headline: "Organizo los cuidados diarios de mi mama y hago seguimiento de turnos.",
    contact: {
      email: "ana.rodri@email.com",
      phone: "+54 351 555 2290",
      secondary: "Contacto alternativo: Joaquin - 351 123 887",
    },
    tags: ["Plan PAMI activo", "Turnos manana", "Preferencia cuidadoras"],
    stats: [
      { value: "2", label: "Solicitudes activas" },
      { value: "3", label: "Familiares a cargo" },
      { value: "4.8", label: "Experiencia con cuidadores" },
    ],
    family: [
      {
        title: "Marta Rodriguez · 78 anos",
        meta: "Asistencia en comidas y movilidad",
        note: "Seguimiento diario de medicacion.",
      },
      {
        title: "Tomas Rodriguez · 45 anos",
        meta: "Apoyo post operatorio semanal",
        note: "Curaciones cada martes y jueves.",
      },
      {
        title: "Abuela Nilda · 84 anos",
        meta: "Acompanamiento recreativo",
        note: "Prefiere caminatas cortas y musica.",
      },
    ],
    requests: [
      {
        title: "Cobertura semanal",
        meta: "Lunes a viernes · 9 a 13 hs",
        note: "Asignado: Maria Lopez · En curso",
      },
      {
        title: "Turno noche puntual",
        meta: "Sabado 20:00 a 00:00",
        note: "En matching - buscando cuidador",
      },
      {
        title: "Visita control",
        meta: "Martes 17 hs",
        note: "Confirmada con Carlos Gomez",
      },
    ],
    preferences: [
      "Cuidador con experiencia en movilidad asistida",
      "Notas por app al cerrar cada turno",
      "Pagos con tarjeta terminada en 4421",
    ],
  },
  caretaker: {
    name: "Marcos Fernandez",
    roleLabel: "CareTaker",
    location: "Cordoba, Argentina",
    headline: "Auxiliar de enfermeria con foco en rehabilitacion leve y estimulo cognitivo.",
    contact: {
      email: "marcos.fernandez@email.com",
      phone: "+54 351 778 910",
      secondary: "Contacto laboral: 351 777 009",
    },
    tags: ["Matricula prov. 45821", "Seguro de responsabilidad", "Turnos cortos y noche"],
    stats: [
      { value: "12", label: "Familias asistidas" },
      { value: "4.9", label: "Promedio de resenas" },
      { value: "32 h", label: "Horas disponibles esta semana" },
    ],
    services: [
      { title: "Acompanamiento diurno", meta: "$4500 / hora", note: "Incluye control de signos y colaciones." },
      { title: "Turno nocturno", meta: "$5200 / hora", note: "Guardia pasiva, monitoreo de suenos." },
      { title: "Rehabilitacion leve", meta: "Pack 6 sesiones", note: "Ejercicios guiados y reportes basicos." },
    ],
    specialties: ["Rehabilitacion", "Movilidad asistida", "Turnos noche", "Primeros auxilios"],
    availability: [
      { title: "Semana", meta: "Lunes a jueves · 8 a 16 hs", note: "Viernes reservado para controles." },
      { title: "Fin de semana", meta: "Sabado 10 a 18 hs", note: "Domingo disponible cada 15 dias." },
      { title: "Urgencias", meta: "24 hs con aviso previo", note: "Confirmacion segun distancia y complejidad." },
    ],
    documents: [
      { title: "Certificado de antecedentes", meta: "Verificado 2025", note: "Vigente" },
      { title: "Vacunacion al dia", meta: "COVID y antigripal", note: "Adjunto en el perfil" },
      { title: "Seguro de responsabilidad civil", meta: "Poliza 5578", note: "Cobertura activa" },
    ],
  },
};

const setPills = (container, items) => {
  if (!container) return;
  container.innerHTML = items.map((item) => `<span class="pill">${item}</span>`).join("");
};

const renderStacked = (container, items) => {
  if (!container) return;
  container.innerHTML = items
    .map(
      (item) => `
        <div class="stacked-item">
          <strong>${item.title}</strong>
          <div class="meta">${item.meta}</div>
          <div class="meta">${item.note}</div>
        </div>
      `
    )
    .join("");
};

const renderStats = (container, stats) => {
  if (!container) return;
  container.innerHTML = stats
    .map(
      (stat) => `
        <div class="col-12 col-md-4">
          <div class="stat-card">
            <span class="value">${stat.value}</span>
            <span class="label">${stat.label}</span>
          </div>
        </div>
      `
    )
    .join("");
};

const setRole = (role) => {
  const data = profiles[role] || profiles.user;
  document.body.dataset.role = role;
  localStorage.setItem("userRole", role);
  console.log(role)

  selectors.name.textContent = data.name;
  selectors.role.textContent = data.roleLabel;
  selectors.location.textContent = data.location;
  selectors.headline.textContent = data.headline;
  selectors.email.textContent = data.contact.email;
  selectors.phone.textContent = data.contact.phone;
  selectors.altContact.textContent = data.contact.secondary;

  setPills(selectors.focusTags, data.tags);
  renderStats(selectors.statsGrid, data.stats);

  document.querySelectorAll("[data-view]").forEach((section) => {
    section.classList.toggle("d-none", section.dataset.view !== role);
  });

  if (role === "USER") {
    renderStacked(selectors.familyList, data.family);
    renderStacked(selectors.requestList, data.requests);
    setPills(selectors.preferenceTags, data.preferences);
  } 
  if(role === "CARETAKER"){
    renderStacked(selectors.serviceList, data.services);
    setPills(selectors.specialtyTags, data.specialties);
    renderStacked(selectors.availabilityList, data.availability);
    renderStacked(selectors.documentList, data.documents);
  }
};

const detectRole = () => {
  const stored = localStorage.getItem("userRole");
  if (stored === "USER" || stored === "CARETAKER") return stored;

  const urlRole = new URLSearchParams(window.location.search).get("role");
  if (urlRole === "USER" || urlRole === "CARETAKER") return urlRole;

  return "USER";
};

document.addEventListener("DOMContentLoaded", () => {
  setRole(detectRole());
});
