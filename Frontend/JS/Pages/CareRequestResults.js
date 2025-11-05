$(document).ready(function() {
  const $resultados = $("#resultadosContainer");

  // Simulación de resultados (hasta conectar al backend)
  const resultadosMock = [
    {
      nombre: "María López",
      fechaInicio: "2025-10-20",
      tipoAtencion: "Cuidador con estudios",
      genero: "Femenino",
      experiencia: "5 años en geriatría",
      tarifa: 4500
    },
    {
      nombre: "Carlos Gómez",
      fechaInicio: "2025-10-21",
      tipoAtencion: "Cuidador sin estudios",
      genero: "Masculino",
      experiencia: "3 años en acompañamiento hospitalario",
      tarifa: 3800
    },
    {
      nombre: "Lucía Pérez",
      fechaInicio: "2025-10-22",
      tipoAtencion: "Estudiante",
      genero: "Femenino",
      experiencia: "Último año de enfermería",
      tarifa: 4000
    }
  ];

  // Render inicial
  renderResultados(resultadosMock);

  // Botón de filtro
  $("#btnFiltrar").click(() => {
    const tipo = $("#tipoAtencionFiltro").val();
    const genero = $("#generoFiltro").val();
    const fecha = $("#fechaInicioFiltro").val();

    const filtrados = resultadosMock.filter(r => {
      return (!tipo || r.tipoAtencion === tipo) &&
             (!genero || r.genero === genero) &&
             (!fecha || r.fechaInicio === fecha);
    });

    renderResultados(filtrados);
  });

  // Función para renderizar resultados
  function renderResultados(lista) {
    $resultados.empty();

    if (lista.length === 0) {
      $resultados.append('<p class="text-center text-light">No se encontraron resultados.</p>');
      return;
    }

    lista.forEach(r => {
      const card = `
        <div class="result-card">
          <h5 class="fw-bold text-primary">${r.nombre}</h5>
          <p class="mb-1"><strong>Tipo:</strong> ${r.tipoAtencion}</p>
          <p class="mb-1"><strong>Experiencia:</strong> ${r.experiencia}</p>
          <p class="mb-1"><strong>Fecha inicio:</strong> ${r.fechaInicio}</p>
          <p class="mb-1"><strong>Género:</strong> ${r.genero}</p>
          <p class="mb-1"><strong>Tarifa:</strong> $${r.tarifa}</p>
          <button class="btn btn-outline-primary btn-sm mt-2">Ver detalle</button>
        </div>
      `;
      $resultados.append(card);
    });
  }
});
