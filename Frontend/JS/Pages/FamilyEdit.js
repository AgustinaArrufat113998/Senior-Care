import { getFamiliar, updateFamiliar } from "../Api/Family.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("edit-family-form");
  const cancelButton = document.getElementById("cancel-edit-btn");

  const params = new URLSearchParams(window.location.search);
  const familiarId = params.get("id");
  const userId = Number(localStorage.getItem("userId"));

  if (!familiarId) {
    form.innerHTML = "<p class='text-danger'>No se especifico el familiar a editar.</p>";
    return;
  }
  if (!userId) {
    form.innerHTML = "<p class='text-danger'>Debes iniciar sesion.</p>";
    return;
  }

  loadFamiliar(familiarId);

  async function loadFamiliar(id) {
    try {
      const fam = await getFamiliar(id);
      document.getElementById("name-edit").value = fam.name || "";
      document.getElementById("dni-edit").value = fam.dni || "";
      document.getElementById("birthdate-edit").value = fam.birthdate || "";
      document.getElementById("relationship-edit").value = fam.relationship || "";
      document.getElementById("observations-edit").value = fam.observations || "";
      document.getElementById("familyPhone-edit").value = fam.phone || "";
      document.getElementById("familyEmail-edit").value = fam.email || "";
    } catch (error) {
      console.error(error);
      form.innerHTML = "<p class='text-danger'>No se pudo cargar el familiar.</p>";
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      name: document.getElementById("name-edit")?.value || "",
      dni: document.getElementById("dni-edit")?.value || "",
      birthdate: document.getElementById("birthdate-edit")?.value || null,
      relationship: document.getElementById("relationship-edit")?.value || "",
      observations: document.getElementById("observations-edit")?.value || "",
      phone: document.getElementById("familyPhone-edit")?.value || "",
      email: document.getElementById("familyEmail-edit")?.value || "",
      userId,
    };

    if (!payload.name || !payload.dni || !payload.birthdate || !payload.relationship || !payload.phone) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    try {
      await updateFamiliar(familiarId, payload);
      alert("Familiar actualizado correctamente.");
      window.location.href = "FamiliList.html";
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar el familiar.");
    }
  });

  cancelButton?.addEventListener("click", () => {
    window.location.href = "FamiliList.html";
  });
});
