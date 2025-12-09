import { getFamilyByUser, deleteFamiliar } from "../Api/Family.js";

document.addEventListener("DOMContentLoaded", () => {
  const familyList = document.getElementById("family-list");
  const addButton = document.getElementById("add-family-btn");

  const userId = Number(localStorage.getItem("userId"));
  if (!userId) {
    familyList.innerHTML = `<p class="text-danger">Debes iniciar sesion para ver tus familiares.</p>`;
    return;
  }

  if (addButton) {
    addButton.addEventListener("click", () => (window.location.href = "FamilyAdd.html"));
  }

  loadFamily(userId);

  async function loadFamily(id) {
    familyList.innerHTML = `<p class="loading-message">Cargando lista de familiares...</p>`;
    try {
      const members = await getFamilyByUser(id);
      renderFamilyList(members);
    } catch (error) {
      console.error(error);
      familyList.innerHTML = `<p class="text-danger">No se pudo cargar la lista.</p>`;
    }
  }

  function renderFamilyList(members = []) {
    familyList.innerHTML = "";
    if (!members.length) {
      familyList.innerHTML = `
        <p style="text-align: center; color: #7f8c8d; padding: 20px; border: 1px dashed #bdc3c7; border-radius: 10px;">
          Aun no tienes familiares registrados.
        </p>
      `;
      return;
    }

    members.forEach((member) => {
      const item = document.createElement("div");
      item.className = "family-item";
      item.dataset.id = member.id;
      item.innerHTML = `
        <div class="family-info">
          <h4>${member.name}</h4>
          <p>Parentesco: ${member.relationship} | DNI: ${member.dni}</p>
          <p class="small text-muted">Telefono: ${member.phone || "-"} ${member.email ? " | Email: " + member.email : ""}</p>
        </div>
        <div class="family-actions">
          <button class="btn-outline-custom edit-btn" data-id="${member.id}" title="Editar">
            <i class="fas fa-pencil-alt"></i>
          </button>
          <button class="btn-cancel delete-btn" data-id="${member.id}" title="Eliminar">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;
      familyList.appendChild(item);
    });

    familyList.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        window.location.href = `FamilyEdit.html?id=${id}`;
      });
    });

    familyList.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.currentTarget.dataset.id;
        const confirmDelete = confirm(`Confirmas la eliminacion del familiar con ID ${id}?`);
        if (!confirmDelete) return;
        try {
          await deleteFamiliar(id);
          loadFamily(userId);
        } catch (error) {
          console.error(error);
          alert("No se pudo eliminar el familiar.");
        }
      });
    });
  }
});
