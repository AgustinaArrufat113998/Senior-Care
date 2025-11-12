$(document).ready(function () {
  // Planes por obra social
  const planes = {
    PAMI: ["Plan Básico", "Plan Plus", "Plan Premium"],
    OSDE: ["210", "310", "410", "510"],
    "Swiss Medical": ["SMG01", "SMG02", "SMG03"],
    Medife: ["Bronce", "Plata", "Oro"],
    Galeno: ["220", "330", "440", "550"]
  };

  // Cargar los años 
  const currentYear = new Date().getFullYear();
  const $anioVencimiento = $("#anioVencimiento");

  $anioVencimiento.append('<option value="" disabled selected>Año</option>');
  for (let i = 0; i < 10; i++) {
    const year = currentYear + i;
    $anioVencimiento.append(`<option value="${year}">${year}</option>`);
  }

  // planes de la obra social seleccionada
  $("#obraSocialSelect").change(function () {
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
  $("input[name='metodoPago']").change(function () {
    const metodoSeleccionado = $("input[name='metodoPago']:checked").val();

    if (metodoSeleccionado === "debito" || metodoSeleccionado === "credito") {
      $("#tarjetaInfo").removeClass("hidden");
    } else {
      $("#tarjetaInfo").addClass("hidden");
    }
  });

  // Validacion simple antes de enviar
  $(".btn-green").click(function (e) {
    e.preventDefault();

    const obra = $("#obraSocialSelect").val();
    const plan = $("#planSelect").val();
    const metodo = $("input[name='metodoPago']:checked").val();

    if (!obra) {
      alert("Por favor, seleccione una obra social.");
      return;
    }

    if (!plan) {
      alert("Por favor, seleccione un plan.");
      return;
    }

    if (!metodo) {
      alert("Por favor, seleccione un método de pago.");
      return;
    }

    if ((metodo === "debito" || metodo === "credito") && !$("#numeroTarjeta").val()) {
      alert("Debe ingresar los datos de la tarjeta.");
      return;
    }

    alert("✅ Solicitud enviada correctamente.");
  });
});
