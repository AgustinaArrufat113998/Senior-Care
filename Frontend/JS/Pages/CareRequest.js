const form = document.getElementById("careRequestForm");
const msg = document.getElementById("msg");
const carrerasContainer = document.getElementById("carrerasContainer");
const cuidadosSimplesContainer = document.getElementById("cuidadosSimplesContainer");

document.querySelectorAll('input[name="tipoAtencion"]').forEach(chk => {
  chk.addEventListener("change", () => {
    const conEstudios = document.getElementById("cuidadorEstudios").checked;
    const estudiante = document.getElementById("estudiante").checked;
    const sinEstudios = document.getElementById("sinEstudios").checked;

    carrerasContainer.classList.toggle("hidden", !(conEstudios || estudiante));
    cuidadosSimplesContainer.classList.toggle("hidden", !sinEstudios);
  });
});

document.querySelectorAll(".carrera-option").forEach(opt => {
  opt.addEventListener("change", () => {
    const seleccionadas = Array.from(document.querySelectorAll(".carrera-option:checked")).map(el => el.value);
    if (seleccionadas.length === 0) {
      carreraDropdown.innerText = "Seleccionar carreras";
    } else if (seleccionadas.length === 1) {
      carreraDropdown.innerText = seleccionadas[0];
    } else {
      carreraDropdown.innerText = `${seleccionadas.length} carreras seleccionadas`;
    }
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  msg.innerText = "";

  const fechaInicio = document.getElementById("fechaInicio").value;
  const fechaFin = document.getElementById("fechaFin").value;
  const horaInicio = document.getElementById("horaInicio").value;
  const horaFin = document.getElementById("horaFin").value;
  const diseases = document.getElementById("diseases").value.trim();
  const medications = document.getElementById("medications").value.trim(); const telefonoEmergencia = document.getElementById("telefonoEmergencia").value.trim(); 
  const tiposSeleccionados = Array.from(document.querySelectorAll('input[name="tipoAtencion"]:checked')).map(chk => chk.value);
  const carrerasSeleccionadas = Array.from(document.querySelectorAll(".carrera-option:checked")).map(opt => opt.value); 

  if (!fechaInicio || !fechaFin || !horaInicio || !horaFin || !diseases || !medications) {
    msg.innerText = "Por favor, complete todos los campos obligatorios.";
    return;
  }

  if (new Date(fechaFin) < new Date(fechaInicio)) {
    msg.innerText = "La fecha de finalización no puede ser anterior a la fecha de inicio.";
    return;
  }

  if (tiposSeleccionados.length === 0) {
    msg.innerText = "Seleccione al menos un tipo de atención preferida.";
    return;
  }

    if (!fechaInicio || !fechaFin || !diseases || !medications || !telefonoEmergencia) {
    msg.innerText = "⚠️ Complete todos los campos obligatorios.";
    return;
  }

  if (fechaInicio < hoy) { 
    msg.innerText = "⚠️ La fecha de inicio no puede ser anterior a la fecha actual.";
    return;
  }

  if (fechaFin < fechaInicio) {
    msg.innerText = "⚠️ La fecha de finalización no puede ser anterior a la fecha de inicio.";
    return;
  }

  if (tiposSeleccionados.length === 0) {
    msg.innerText = "⚠️ Seleccione al menos un tipo de atención preferida.";
    return;
  }

  if ((document.getElementById("cuidadorEstudios").checked || document.getElementById("estudiante").checked) && carrerasSeleccionadas.length === 0) { // 🆕
    msg.innerText = "⚠️ Seleccione al menos una carrera o especialidad.";
    return;
  }

  if (!/^\d{10,15}$/.test(telefonoEmergencia)) { // 🆕
    msg.innerText = "⚠️ Ingrese un teléfono de emergencia válido (solo números, sin espacios ni guiones).";
    return;
  }

  alert("Solicitud enviada con éxito.\nTipos seleccionados: " + tiposSeleccionados.join(", "));
  form.reset();
  carrerasContainer.classList.add("hidden");
  cuidadosSimplesContainer.classList.add("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
  cargarOpciones("enfermedades", "/api/enfermedades");
  cargarOpciones("medicaciones", "/api/medicaciones");
  cargarOpciones("alergias", "/api/alergias");
  cargarOpciones("condiciones", "/api/condiciones");
});

function cargarOpciones(idSelect, endpoint) {
  fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      const select = document.getElementById(idSelect);
      data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.nombre;
        select.appendChild(option);
      });
    })
    .catch((err) => console.error(`Error cargando ${idSelect}:`, err));
}
