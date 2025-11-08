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

form.addEventListener("submit", (e) => {
  e.preventDefault();
  msg.innerText = "";

  const fechaInicio = document.getElementById("fechaInicio").value;
  const fechaFin = document.getElementById("fechaFin").value;
  const horaInicio = document.getElementById("horaInicio").value;
  const horaFin = document.getElementById("horaFin").value;
  const diseases = document.getElementById("diseases").value.trim();
  const medications = document.getElementById("medications").value.trim();
  const tiposSeleccionados = Array.from(document.querySelectorAll('input[name="tipoAtencion"]:checked')).map(chk => chk.value);

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

  alert("Solicitud enviada con éxito.\nTipos seleccionados: " + tiposSeleccionados.join(", "));
  form.reset();
  carrerasContainer.classList.add("hidden");
  cuidadosSimplesContainer.classList.add("hidden");
});
