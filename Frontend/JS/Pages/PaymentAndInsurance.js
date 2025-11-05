$(document).ready(function() {
  // Planes por obra social
  const planes = {
    PAMI: ["Plan Básico", "Plan Plus", "Plan Premium"],
    OSDE: ["210", "310", "410", "510"],
    "Swiss Medical": ["SMG01", "SMG02", "SMG03"],
    Medife: ["Bronce", "Plata", "Oro"],
    Galeno: ["220", "330", "440", "550"]
  };

  // Cargar los años próximos en el desplegable
  const currentYear = new Date().getFullYear();
  const $anioVencimiento = $("#anioVencimiento");

  $anioVencimiento.append('<option value="" disabled selected>Año</option>');
  for (let i = 0; i < 10; i++) {
    const year = currentYear + i;
    $anioVencimiento.append(`<option value="${year}">${year}</option>`);
  }

  // Actualizar los planes según la obra social
  $("#obraSocialSelect").change(function() {
    const obra = $(this).val();
    const planSelect = $("#planSelect");
    planSelect.empty().append('<option value="" disabled selected>Seleccione un plan</option>');
    if (planes[obra]) {
      planes[obra].forEach(plan => {
        planSelect.append(`<option value="${plan}">${plan}</option>`);
      });
    }
  });

  // Mostrar u ocultar los campos de tarjeta
  $("#debito, #credito").change(function() {
    if ($("#debito").is(":checked") || $("#credito").is(":checked")) {
      $("#tarjetaInfo").removeClass("hidden");
    } else {
      $("#tarjetaInfo").addClass("hidden");
    }
  });
});
