document.addEventListener("DOMContentLoaded", () => {

  // === Selección de habilidades ===
  const skillButtons = document.querySelectorAll('.skill-btn');
  const hiddenInput = document.getElementById('habilidadesSeleccionadas');
  const msg = document.getElementById("msg");

  skillButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const selected = [...document.querySelectorAll('.skill-btn.active')].map(b => b.dataset.skill);
      hiddenInput.value = selected.join(', ');
    });
  });

  // === Manejo del formulario ===
  document.getElementById("caregiverForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const estudios = document.getElementById("estudios").value.trim();
    const experiencia = document.getElementById("experiencia").value.trim();
    const disponibilidad = document.getElementById("disponibilidad").value.trim();
    const tarifa = document.getElementById("tarifa").value.trim();
    const contactoSecundario = document.getElementById("contactoSecundario").value.trim();
    const habilidades = hiddenInput.value.trim();
    const tituloFile = document.getElementById("tituloFile").files[0];

    if (!habilidades) {
      msg.style.color = "red";
      msg.textContent = "Seleccioná al menos una habilidad.";
      return;
    }

    try {
      const formData = new FormData();
      formData.append("estudios", estudios);
      formData.append("experiencia", experiencia);
      formData.append("disponibilidad", disponibilidad);
      formData.append("tarifa", tarifa);
      formData.append("contactoSecundario", contactoSecundario);
      formData.append("habilidades", habilidades);
      if (tituloFile) formData.append("tituloFile", tituloFile);

      const response = await fetch("http://localhost:8081/api/caregivers", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        msg.style.color = "green";
        msg.textContent = "Registro exitoso 🎉";
        setTimeout(() => (msg.textContent = ""), 5000);
        document.getElementById("caregiverForm").reset();
        skillButtons.forEach(b => b.classList.remove("active"));
        hiddenInput.value = "";
      } else {
        msg.style.color = "red";
        msg.textContent = "Error al registrar. Intentalo nuevamente.";
        setTimeout(() => (msg.textContent = ""), 5000);
      }
    } catch (error) {
      msg.style.color = "red";
      msg.textContent = "Error de conexión con el servidor.";
      setTimeout(() => (msg.textContent = ""), 5000);
    }
  });

});
