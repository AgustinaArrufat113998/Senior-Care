$(document).ready(function () {
  // Planes por obra social
  const planes = {
    "Sin obra social": [],
    PAMI: ["Plan Basico", "Plan Plus", "Plan Premium"],
    OSDE: ["210", "310", "410", "510"],
    "Swiss Medical": ["SMG01", "SMG02", "SMG03"],
    Medife: ["Bronce", "Plata", "Oro"],
    Galeno: ["220", "330", "440", "550"],
  };

  const $planContainer = $("#planContainer");
  const $planSelect = $("#planSelect");
  const $actionButton = $("#btnAccionPago");
  const defaultPayLabel = "🤝 Proceder al pago";
  const cashLabel = "Enviar solicitud";

  // Cargar los anos
  const currentYear = new Date().getFullYear();
  const $anioVencimiento = $("#anioVencimiento");

  if ($anioVencimiento.length) {
    $anioVencimiento.append('<option value="" disabled selected>Ano</option>');
    for (let i = 0; i < 10; i++) {
      const year = currentYear + i;
      $anioVencimiento.append(`<option value="${year}">${year}</option>`);
    }
  }

  // planes de la obra social seleccionada
  $("#obraSocialSelect").change(function () {
    const obra = $(this).val();
    $planSelect.empty().append('<option value="" disabled selected>Seleccione un plan</option>');

    if (planes[obra] && planes[obra].length) {
      $planContainer.removeClass("hidden");
      $planSelect.prop("required", true);
      planes[obra].forEach((plan) => {
        $planSelect.append(`<option value="${plan}">${plan}</option>`);
      });
    } else {
      $planContainer.addClass("hidden");
      $planSelect.prop("required", false);
      $planSelect.val("");
    }
  });

  // Cambiar etiqueta del boton segun metodo de pago
  $("input[name='metodoPago']").change(function () {
    const metodoSeleccionado = $("input[name='metodoPago']:checked").val();
    if (metodoSeleccionado === "efectivo") {
      $actionButton.text(cashLabel);
    } else {
      $actionButton.text(defaultPayLabel);
    }
  });

  $actionButton.click(async function (e) {
    e.preventDefault();

    const obra = $("#obraSocialSelect").val();
    const plan = $("#planSelect").val();
    const metodo = $("input[name='metodoPago']:checked").val();

    if (!obra) {
      alert("Por favor, seleccione una obra social.");
      return;
    }

    if ($planContainer.is(":visible") && !plan) {
      alert("Por favor, seleccione un plan.");
      return;
    }

    if (!metodo) {
      alert("Por favor, seleccione un metodo de pago.");
      return;
    }

    // Si paga con tarjeta, validar (por ahora solo mp/efectivo)
    if ((metodo === "debito" || metodo === "credito") && !$("#numeroTarjeta").val()) {
      alert("Debe ingresar los datos de la tarjeta.");
      return;
    }

    //  crear el cuerpo de la preferencia
    const preferenceBody = {
      title: "Servicio SeniorCare",
      description: "Pago por contratacion de cuidado",
      quantity: 1,
      price: 1,
      externalReference: "SC-001",
    };

    if (metodo === "efectivo") {
      window.location.href = "WaitingRoom.html";
      return;
    }

    try {
      // llamada al backend
      const response = await fetch("https://toey-pat-respectably.ngrok-free.dev/api/payments/preference", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferenceBody),
      });

      if (!response.ok) {
        throw new Error("Error al generar preferencia de pago");
      }

      const data = await response.json();

      console.log("Preferencia creada:", data);

      //redirigir al Checkout Pro
      window.location.href = data.initPoint;
    } catch (error) {
      console.error(error);
      alert("Ocurrio un error al generar el pago.");
    }
  });
});
