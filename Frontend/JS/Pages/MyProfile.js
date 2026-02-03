import { getUserProfileById } from "../Api/userApi.js";

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
  hourlyRate: document.getElementById("hourlyRate"),
  totalEarnings: document.getElementById("totalEarnings"),
  servicesCount: document.getElementById("servicesCount"),
  transactionsList: document.getElementById("transactionsList"),
  viewAllServices: document.getElementById("viewAllServices"),
};

const roleTemplates = {
  USER: {
    roleLabel: "Usuario",
    headline: "Gestiona tus datos y mira tu actividad.",
    tags: [],
    stats: [],
    family: [],
    requests: [],
    preferences: [],
  },
  CARETAKER: {
    roleLabel: "CareTaker",
    headline: "Comparte tu disponibilidad y experiencia con familias.",
    tags: [],
    stats: [],
    services: [],
    specialties: [],
    availability: [],
    documents: [],
    hourlyRate: "$4.500 / hora",
    totalEarnings: "$128.000",
    servicesCount: "14 servicios",
    transactions: [
      {
        title: "Turno nocturno",
        meta: "Sabado 21:00 - 02:00",
        note: "Pagado - $22.500",
      },
      {
        title: "Acompanamiento diurno",
        meta: "Miercoles 09:00 - 13:00",
        note: "Pagado - $18.000",
      },
      {
        title: "Rehabilitacion leve",
        meta: "Sesion individual",
        note: "Pagado - $9.500",
      },
      {
        title: "Turno tarde",
        meta: "Lunes 16:00 - 19:00",
        note: "Pagado - $13.500",
      },
      {
        title: "Guardia breve",
        meta: "Domingo 08:00 - 10:00",
        note: "Pendiente de cobro",
      },
    ],
  },
  ADMIN: {
    roleLabel: "Admin",
    headline: "Gestiona usuarios y actividad.",
    tags: [],
    stats: [],
    family: [],
    requests: [],
    preferences: [],
  },
};

const normalizeRole = (role) =>
  role === "CARETAKER" || role === "ADMIN" || role === "USER" ? role : "USER";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("es-AR", { year: "numeric", month: "short" });
};

const formatLocation = (profile) => {
  const city = profile?.address?.street?.city?.name;
  const country = profile?.address?.street?.city?.country?.name;
  if (city && country) return `${city}, ${country}`;
  if (city) return city;
  return "Ubicacion no disponible";
};

const buildStats = (profile) => {
  const stats = [];
  if (profile?.id) {
    stats.push({ value: `#${profile.id}`, label: "ID de usuario" });
  }
  const createdAt = formatDate(profile?.createdAt);
  if (createdAt) {
    stats.push({ value: createdAt, label: "Registro" });
  }
  const birthDate = formatDate(profile?.birthDate);
  if (birthDate) {
    stats.push({ value: birthDate, label: "Nacimiento" });
  }
  return stats;
};

const buildProfile = (role, profile, fallbackEmail) => {
  const base = roleTemplates[role] || roleTemplates.USER;
  const fullName = [profile?.name, profile?.surname].filter(Boolean).join(" ");
  const name = fullName || fallbackEmail || "Mi perfil";
  const email = profile?.email || fallbackEmail || "No disponible";
  const phone = profile?.phone || "No informado";
  const document =
    profile?.dni
      ? `DNI: ${profile.dni}`
      : profile?.username
        ? `Usuario: ${profile.username}`
        : "No informado";

  return {
    ...base,
    name,
    roleLabel: base.roleLabel,
    location: formatLocation(profile),
    contact: {
      email,
      phone,
      document,
    },
    hourlyRate: profile?.hourlyRate || base.hourlyRate,
    totalEarnings: profile?.totalEarnings || base.totalEarnings,
    servicesCount: profile?.servicesCount || base.servicesCount,
    transactions: profile?.transactions || base.transactions,
    stats: buildStats(profile),
  };
};

const setPills = (container, items) => {
  if (!container) return;
  if (!items || items.length === 0) {
    container.innerHTML = '<span class="pill pill-muted">Sin datos</span>';
    return;
  }
  container.innerHTML = items.map((item) => `<span class="pill">${item}</span>`).join("");
};

const renderStacked = (container, items) => {
  if (!container) return;
  if (!items || items.length === 0) {
    container.innerHTML = '<p class="text-muted mb-0">Sin registros</p>';
    return;
  }
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

const renderTransactions = (container, items, expanded) => {
  if (!container) return;
  if (!items || items.length === 0) {
    container.innerHTML = '<p class="text-muted mb-0">Sin movimientos</p>';
    return;
  }
  const visibleItems = expanded ? items : items.slice(0, 3);
  container.innerHTML = visibleItems
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
  if (!stats || stats.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="stat-card">
          <span class="label">Sin estadisticas</span>
        </div>
      </div>
    `;
    return;
  }
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

const renderProfile = (role, profile) => {
  const resolvedRole = normalizeRole(profile?.role || role);
  const fallbackEmail = localStorage.getItem("userEmail");
  const data = buildProfile(resolvedRole, profile, fallbackEmail);
  const viewRole = resolvedRole === "CARETAKER" ? "caretaker" : "user";

  document.body.dataset.role = resolvedRole;
  localStorage.setItem("userRole", resolvedRole);

  selectors.name.textContent = data.name;
  selectors.role.textContent = data.roleLabel;
  selectors.location.textContent = data.location;
  selectors.headline.textContent = data.headline;
  selectors.email.textContent = data.contact.email;
  selectors.phone.textContent = data.contact.phone;
  selectors.altContact.textContent = data.contact.document;

  setPills(selectors.focusTags, data.tags);
  renderStats(selectors.statsGrid, data.stats);

  document.querySelectorAll("[data-view]").forEach((section) => {
    section.classList.toggle("d-none", section.dataset.view !== viewRole);
  });

  if (viewRole === "user") {
    renderStacked(selectors.familyList, data.family);
    renderStacked(selectors.requestList, data.requests);
    setPills(selectors.preferenceTags, data.preferences);
  }

  if (viewRole === "caretaker") {
    renderStacked(selectors.serviceList, data.services);
    setPills(selectors.specialtyTags, data.specialties);
    renderStacked(selectors.availabilityList, data.availability);
    renderStacked(selectors.documentList, data.documents);

    if (selectors.hourlyRate) selectors.hourlyRate.textContent = data.hourlyRate;
    if (selectors.totalEarnings) selectors.totalEarnings.textContent = data.totalEarnings;
    if (selectors.servicesCount) selectors.servicesCount.textContent = data.servicesCount;
    renderTransactions(selectors.transactionsList, data.transactions, false);

    if (selectors.viewAllServices) {
      const hasMore = data.transactions && data.transactions.length > 3;
      selectors.viewAllServices.classList.toggle("d-none", !hasMore);
      selectors.viewAllServices.dataset.expanded = "false";
      selectors.viewAllServices.textContent = "Ver todos los servicios";
      selectors.viewAllServices.onclick = () => {
        const expanded = selectors.viewAllServices.dataset.expanded === "true";
        selectors.viewAllServices.dataset.expanded = expanded ? "false" : "true";
        selectors.viewAllServices.textContent = expanded
          ? "Ver todos los servicios"
          : "Ver menos servicios";
        renderTransactions(selectors.transactionsList, data.transactions, !expanded);
      };
    }
  }
};

const detectRole = () => {
  const stored = localStorage.getItem("userRole");
  if (stored === "USER" || stored === "CARETAKER" || stored === "ADMIN") return stored;

  const urlRole = new URLSearchParams(window.location.search).get("role");
  if (urlRole === "USER" || urlRole === "CARETAKER" || urlRole === "ADMIN") return urlRole;

  return "USER";
};

document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("jwtToken");
  const role = detectRole();

  let profile = null;
  if (userId) {
    profile = await getUserProfileById(userId, token);
  }

  renderProfile(role, profile);
});
