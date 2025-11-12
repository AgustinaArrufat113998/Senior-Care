$(document).ready(function () {
  const solicitudId = 1; // reemplazarlo por un ID dinámico obtenido de la URL 

  // Cargar datos
  fetch(`https://api.seniorcare.com/care-requests/${solicitudId}`)
    .then(response => response.json())
    .then(data => {
      // Mostrar los datos en pantalla
      $("#pacienteNombre").text(data.pacienteNombre);
      $("#pacienteEdad").text(data.pacienteEdad + " años");
      $("#pacienteCondiciones").text(data.pacienteCondiciones);
      $("#pacienteEnfermedades").text(data.pacienteEnfermedades);
      $("#fechaInicio").text(data.fechaInicio);
      $("#fechaFin").text(data.fechaFin);
      $("#horario").text(data.horario);
      $("#direccion").text(data.direccion);
      $("#tipoAtencion").text(data.tipoAtencion);
      $("#obraSocial").text(data.obraSocial);
      $("#metodoPago").text(data.metodoPago);
      $("#tarifa").text(data.tarifa);
    })
    .catch(err => {
      $("#msg").text("❌ Error al obtener los datos de la solicitud.").css("color", "red");
      console.error("Error al cargar solicitud:", err);
    });


  $("#aceptarBtn").click(async function () {
    try {
      const response = await fetch(`https://api.seniorcare.com/care-requests/${solicitudId}/accept`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado: "ACEPTADO",
          cuidadorId: 7, 
          fechaRespuesta: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        $("#msg").text("✅ Has aceptado la solicitud. El familiar será notificado.").css("color", "green");
      } else {
        $("#msg").text("⚠️ No se pudo registrar la aceptación. Intente nuevamente.").css("color", "orange");
      }
    } catch (error) {
      console.error("Error al aceptar solicitud:", error);
      $("#msg").text("❌ Error de conexión con el servidor.").css("color", "red");
    }
  });

 
  $("#rechazarBtn").click(async function () {
    try {
      const response = await fetch(`https://api.seniorcare.com/care-requests/${solicitudId}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado: "RECHAZADO",
          cuidadorId: 7,
          fechaRespuesta: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        $("#msg").text("❌ Has rechazado la solicitud.").css("color", "red");
      } else {
        $("#msg").text("⚠️ No se pudo registrar el rechazo. Intente nuevamente.").css("color", "orange");
      }
    } catch (error) {
      console.error("Error al rechazar solicitud:", error);
      $("#msg").text("❌ Error de conexión con el servidor.").css("color", "red");
    }
  });
});
