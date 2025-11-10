// === VALIDACIÓN GLOBAL DE FORMULARIOS ===

document.addEventListener("DOMContentLoaded", () => {
  // 1️⃣ Agrega asterisco a todos los campos requeridos
  document.querySelectorAll("label").forEach(label => {
    const inputId = label.getAttribute("for");
    if (!inputId) return;
    const input = document.getElementById(inputId);
    if (input && input.hasAttribute("required")) {
      label.classList.add("required"); // usa la clase del Global.css
    }
  });

  // 2️⃣ Valida cada formulario con required
  document.querySelectorAll("form").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      let isValid = true;

      // Limpiar errores previos
      form.querySelectorAll(".Ginput-error").forEach(i => i.classList.remove("Ginput-error"));

      // Recorre todos los campos obligatorios
      form.querySelectorAll("[required]").forEach(input => {
        if (!input.value.trim()) {
          input.classList.add("Ginput-error");
          isValid = false;
        }
      });

      // Si no es válido
      const msg = form.querySelector("#msg");
      if (!isValid) {
        if (msg) msg.textContent = "Por favor completa todos los campos obligatorios.";
        return;
      }

      // Si es válido, se puede enviar
      if (msg) msg.textContent = "";
      form.submit(); // 🔹 aquí se enviaría normalmente
    });

    // 3️⃣ Remueve borde rojo al escribir
    form.querySelectorAll("[required]").forEach(input => {
      input.addEventListener("input", () => {
        input.classList.remove("Ginput-error");
      });
    });
  });
});
