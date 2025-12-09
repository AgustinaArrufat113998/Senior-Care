import { addFamiliar } from "../Api/Family.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("add-family-form");
  const cancelButton = document.getElementById("cancel-btn");
  const userId = Number(localStorage.getItem("userId"));

  if (!userId && form) {
    form.innerHTML = "<p class='text-danger'>Debes iniciar sesion para agregar familiares.</p>";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById("name")?.value || "",
      dni: document.getElementById("dni")?.value || "",
      birthdate: document.getElementById("birthdate")?.value || null,
      relationship: document.getElementById("relationship")?.value || "",
      observations: document.getElementById("observations")?.value || "",
      phone: document.getElementById("familyPhone")?.value || "",
      email: document.getElementById("familyEmail")?.value || "",
      userId,
    };

    if (!payload.name || !payload.dni || !payload.birthdate || !payload.relationship || !payload.phone) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    try {
      await addFamiliar(payload);
      alert("Familiar agregado exitosamente.");
      window.location.href = "FamiliList.html";
    } catch (error) {
      console.error(error);
      alert("No se pudo agregar el familiar.");
    }
  });

  cancelButton?.addEventListener("click", () => {
    window.location.href = "FamiliList.html";
  });
});
