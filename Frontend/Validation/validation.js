$.validator.addMethod("soloLetras", function(value, element) {
  return /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(value);
}, "* Solo se permiten letras.");

$.validator.addMethod("formatoDisponibilidad", function(value, element) {
  return /[a-zA-Z]+/.test(value) && /\d/.test(value);
}, "* Ingrese días y horarios válidos.");

$.validator.addMethod("tarifaMinima", function(value, element) {
  return parseFloat(value) >= 1000;
}, "* La tarifa mínima es de $1000.");


$(document).ready(function () {
  $("#caregiverForm").validate({
    rules: {
      estudios: {
        required: true,
        soloLetras: true,
        minlength: 3
      },
      experiencia: {
        required: true,
        minlength: 5
      },
      disponibilidad: {
        required: true,
        formatoDisponibilidad: true
      },
      tarifa: {
        required: true,
        number: true,
        tarifaMinima: true
      },
      contactoSecundario: {
        digits: true,
        minlength: 8,
        maxlength: 15
      },
      tituloFile: {
        extension: "pdf|jpg|jpeg|png"
      }
    },
    messages: {
      estudios: {
        required: "* Ingrese su especialidad o estudios.",
        minlength: "* Mínimo 3 caracteres."
      },
      experiencia: {
        required: "* Ingrese su experiencia laboral.",
        minlength: "* Mínimo 5 caracteres."
      },
      disponibilidad: {
        required: "* Ingrese su disponibilidad horaria."
      },
      tarifa: {
        required: "* Ingrese su tarifa por hora.",
        number: "* Solo números.",
        tarifaMinima: "* La tarifa mínima es de $1000."
      },
      contactoSecundario: {
        digits: "* Solo números.",
        minlength: "* Al menos 8 dígitos.",
        maxlength: "* Máximo 15 dígitos."
      },
      tituloFile: {
        extension: "* Solo PDF o imágenes (JPG, PNG)."
      }
    },
    errorElement: "label",
    errorClass: "error text-danger mt-1",
    submitHandler: function(form) {
      alert("✅ Registro completado correctamente!");
      form.submit();
    }
  });
});

// =========================
// VALIDACIÓN - Solicitud de nuevo cuidado
// =========================
if ($("#careRequestForm").length) {
  $("#careRequestForm").validate({
    rules: {
      fechaInicio: {
        required: true,
        date: true
      },
      fechaFin: {
        required: true,
        date: true
      },
      horaInicio: {
        required: true
      },
      horaFin: {
        required: true
      },
      telefonoEmergencia: {
        required: true,
        digits: true,
        minlength: 8,
        maxlength: 15
      },
      diseases: {
        required: true,
        minlength: 3
      },
      medications: {
        required: true,
        minlength: 3
      },
      allergies: {
        minlength: 3
      },
      careSuggestions: {
        maxlength: 200
      }
    },
    messages: {
      fechaInicio: {
        required: "* Seleccione una fecha de inicio."
      },
      fechaFin: {
        required: "* Seleccione una fecha de finalización."
      },
      horaInicio: {
        required: "* Ingrese la hora de inicio."
      },
      horaFin: {
        required: "* Ingrese la hora de finalización."
      },
      telefonoEmergencia: {
        required: "* Ingrese un teléfono de emergencia.",
        digits: "* Solo números.",
        minlength: "* Mínimo 8 dígitos.",
        maxlength: "* Máximo 15 dígitos."
      },
      diseases: {
        required: "* Indique las enfermedades del paciente.",
        minlength: "* Ingrese al menos 3 caracteres."
      },
      medications: {
        required: "* Indique las medicaciones del paciente.",
        minlength: "* Ingrese al menos 3 caracteres."
      },
      allergies: {
        minlength: "* Ingrese al menos 3 caracteres si aplica."
      },
      careSuggestions: {
        maxlength: "* Máximo 200 caracteres."
      }
    },
    errorElement: "label",
    errorClass: "error text-danger mt-1",
    submitHandler: function(form) {
      // Validar que al menos un tipo de atención esté seleccionado
      const tipoAtencionSeleccionado = $("input[name='tipoAtencion']:checked").length > 0;
      if (!tipoAtencionSeleccionado) {
        alert("⚠️ Debe seleccionar al menos un tipo de atención preferida.");
        return false;
      }

      // Validar que la fecha de fin sea posterior a la de inicio
      const inicio = new Date($("#fechaInicio").val());
      const fin = new Date($("#fechaFin").val());
      if (inicio > fin) {
        alert("⚠️ La fecha de finalización debe ser posterior a la de inicio.");
        return false;
      }

      // Si todo está correcto
      alert("✅ Solicitud de cuidado enviada correctamente!");
      form.submit();
    }
  });
}

// =========================
// VALIDACIÓN - Login
// =========================
if ($("#loginForm").length) {
  $("#loginForm").validate({
    rules: {
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 6
      }
    },
    messages: {
      email: {
        required: "* Ingrese su correo electrónico.",
        email: "* Formato de correo inválido (ejemplo@dominio.com)."
      },
      password: {
        required: "* Ingrese su contraseña.",
        minlength: "* La contraseña debe tener al menos 6 caracteres."
      }
    },
    errorElement: "label",
    errorClass: "error text-danger mt-1",
    submitHandler: function(form) {
      alert("✅ Inicio de sesión correcto!");
      form.submit();
    }
  });
}

// =========================
// VALIDACIÓN - Registro de Usuario
// =========================
if ($("#registerForm").length) {
  $("#registerForm").validate({
    rules: {
      nombre: {
        required: true,
        minlength: 2,
        soloLetras: true
      },
      apellido: {
        required: true,
        minlength: 2,
        soloLetras: true
      },
      username: {
        required: true,
        minlength: 4
      },
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 6
      },
      confirmPassword: {
        required: true,
        equalTo: "#password"
      },
      dni: {
        required: true,
        digits: true,
        minlength: 7,
        maxlength: 8
      },
      telefono: {
        required: true,
        digits: true,
        minlength: 8,
        maxlength: 15
      },
      fechaNacimiento: {
        required: true,
        date: true
      },
      sexo: {
        required: true
      },
      edad: {
        required: true,
        digits: true,
        min: 18,
        max: 130
      },
      obraSocial: {
        required: true
      },
      calle: {
        required: true,
        minlength: 3
      },
      nroCasa: {
        required: true,
        digits: true
      },
      pais: {
        required: true
      },
      provincia: {
        required: true
      }
    },
    messages: {
      nombre: {
        required: "* Ingrese su nombre.",
        minlength: "* Mínimo 2 caracteres."
      },
      apellido: {
        required: "* Ingrese su apellido.",
        minlength: "* Mínimo 2 caracteres."
      },
      username: {
        required: "* Ingrese un nombre de usuario.",
        minlength: "* Mínimo 4 caracteres."
      },
      email: {
        required: "* Ingrese su correo electrónico.",
        email: "* Formato de correo inválido."
      },
      password: {
        required: "* Ingrese una contraseña.",
        minlength: "* Debe tener al menos 6 caracteres."
      },
      confirmPassword: {
        required: "* Repita la contraseña.",
        equalTo: "* Las contraseñas no coinciden."
      },
      dni: {
        required: "* Ingrese su DNI.",
        digits: "* Solo números.",
        minlength: "* Debe tener al menos 7 dígitos.",
        maxlength: "* No puede superar 8 dígitos."
      },
      telefono: {
        required: "* Ingrese su número de teléfono.",
        digits: "* Solo números.",
        minlength: "* Mínimo 8 dígitos.",
        maxlength: "* Máximo 15 dígitos."
      },
      fechaNacimiento: {
        required: "* Ingrese su fecha de nacimiento."
      },
      sexo: {
        required: "* Seleccione su sexo."
      },
      edad: {
        required: "* Ingrese su edad.",
        digits: "* Solo números.",
        min: "* Debe ser mayor de edad (18+).",
        max: "* Ingrese una edad válida."
      },
      obraSocial: {
        required: "* Seleccione su obra social."
      },
      calle: {
        required: "* Ingrese su calle o barrio.",
        minlength: "* Mínimo 3 caracteres."
      },
      nroCasa: {
        required: "* Ingrese el número de casa.",
        digits: "* Solo números."
      },
      pais: {
        required: "* Seleccione su país."
      },
      provincia: {
        required: "* Seleccione su provincia."
      }
    },
    errorElement: "label",
    errorClass: "error text-danger mt-1",
    submitHandler: function(form) {
      alert("✅ Registro completado correctamente!");
      form.submit();
    }
  });
}

