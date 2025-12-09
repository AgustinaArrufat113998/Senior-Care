const API_USER_URL = "http://localhost:8081/api";

const starsContainer = document.getElementById("starsContainer");
const ratingText = document.getElementById("ratingText");
const nameEl = document.getElementById("nombreCuidador");
const carerInfo = document.getElementById("carerInfo");
const alertBox = document.getElementById("alertBox");
const form = document.getElementById("ratingForm");
const backBtn = document.getElementById("backBtn");
const submitBtn = document.getElementById("submitBtn");

const params = new URLSearchParams(window.location.search);
const carerId = params.get("carerId");
const requestId = params.get("requestId");
const prefillName = params.get("carerName") ? decodeURIComponent(params.get("carerName")) : "";

let currentScore = 0;

init();

function init() {
  attachStars();
  if (backBtn) backBtn.addEventListener("click", () => window.history.back());
  if (form) form.addEventListener("submit", handleSubmit);
  if (prefillName && nameEl) nameEl.textContent = prefillName;
  preloadCarer();
}

function attachStars() {
  if (!starsContainer) return;
  starsContainer.querySelectorAll(".star").forEach((star) => {
    star.addEventListener("click", () => {
      const value = Number(star.dataset.value);
      currentScore = value;
      updateStars(value);
    });
  });
}

function updateStars(value) {
  starsContainer.querySelectorAll(".star").forEach((star) => {
    const active = Number(star.dataset.value) <= value;
    star.classList.toggle("active", active);
  });
  if (ratingText) {
    ratingText.textContent = value ? `Calificacion: ${value} / 5` : "";
  }
}

async function preloadCarer() {
  if (!carerId) {
    setAlert("No se recibio el cuidador a calificar.", "danger");
    if (submitBtn) submitBtn.disabled = true;
    return;
  }
  try {
    const res = await fetch(`${API_USER_URL}/carer/{id}?id=${carerId}`);
    console.log(res);
    if (!res.ok) throw new Error("No se pudo obtener el cuidador");
    const carer = await res.json();
    if (nameEl) nameEl.textContent = `${carer.firstName || ""} ${carer.lastName || ""}`.trim() || "Cuidador";
    if (carerInfo) {
      const rating = carer.averageRating ? `${carer.averageRating.toFixed(1)} / 5` : "Sin calificaciones";
      carerInfo.textContent = `• ${rating}`;
    }
    setAlert("", "");
  } catch (err) {
    console.error(err);
    setAlert("No se pudieron cargar los datos del cuidador.", "warning");
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  const userId = Number(localStorage.getItem("userId"));
  if (!userId) {
    return setAlert("Debes iniciar sesion para calificar.", "danger");
  }
  if (!carerId) {
    return setAlert("Falta el identificador del cuidador.", "danger");
  }
  if (!currentScore) {
    return setAlert("Selecciona una calificacion con estrellas.", "warning");
  }

  const payload = {
    score: currentScore,
    comment: document.getElementById("comentario")?.value || "",
    punctuality: document.getElementById("puntualidad")?.value || "",
    treatment: document.getElementById("trato")?.value || "",
    userId,
  };

  try {
    toggleSubmit(true);
    const res = await fetch(`${API_USER_URL}/carer/${carerId}/ratings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log(payload);
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "No se pudo guardar la valoracion");
    }
    setAlert("¡Gracias por tu valoracion!", "success");
    form?.reset();
    currentScore = 0;
    updateStars(0);
    if (requestId) {
      setTimeout(() => {
        window.location.href = `MyRequests.html`;
      }, 1200);
    }
  } catch (error) {
    console.error(error);
    setAlert("Hubo un problema al enviar la valoracion.", "danger");
  } finally {
    toggleSubmit(false);
  }
}

function setAlert(message, type) {
  if (!alertBox) return;
  if (!message) {
    alertBox.classList.add("d-none");
    alertBox.textContent = "";
    return;
  }
  alertBox.className = `alert alert-${type || "info"}`;
  alertBox.textContent = message;
}

function toggleSubmit(disabled) {
  if (submitBtn) submitBtn.disabled = disabled;
}
