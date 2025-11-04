document.getElementById("caregiverForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = document.getElementById("caregiverForm");

  // Validación básica
  if (!form.checkValidity()) {
    document.getElementById("msg").innerText = "Por favor complete todos los campos obligatorios";
    form.reportValidity();
    return;
  }

  const data = {
    studies: document.getElementById("estudios").value.trim(),
    experience: document.getElementById("experiencia").value.trim(),
    availability: document.getElementById("disponibilidad").value.trim(),
    rate: parseFloat(document.getElementById("tarifa").value) || 0,
    secondary_contact: document.getElementById("contactoSecundario").value.trim()
  };

  try {
    // ⚠️ CORREGIR URL con la dirección real del backend
    const response = await fetch("http://localhost:8081/api/caregivers/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert("✅ Cuidador registrado con éxito!");
      window.location.href = "login.html";
    } else {
      const errorMsg = await response.text();
      document.getElementById("msg").innerText = "⚠️ Error al registrar cuidador: " + errorMsg;
    }
  } catch (err) {
    console.error("Error al conectar con el backend:", err);
    document.getElementById("msg").innerText = "❌ No se pudo conectar con el sistema";
  }
});
