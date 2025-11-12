$(document).ready(function () {
  $("#editProfileForm").on("submit", function (e) {
    e.preventDefault();

    const updatedUser = {
      nombre: $("#nombre").val(),
      apellido: $("#apellido").val(),
      username: $("#username").val(),
      email: $("#email").val(),
      dni: $("#dni").val(),
      telefono: $("#telefono").val(),
      fechaNacimiento: $("#fechaNacimiento").val(),
      sexo: $("#sexo").val(),
      obraSocial: $("#obraSocial").val(),
      plan: $("#plan").val(),
      calle: $("#calle").val(),
      nroCasa: $("#nroCasa").val(),
      pais: $("#pais").val(),
      provincia: $("#provincia").val(),
    };

    console.log("Datos actualizados:", updatedUser);

    // Ejemplo de request (cuando conectes backend)
    /*
    fetch("http://localhost:8000/api/users/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    })
      .then(res => res.json())
      .then(() => alert("Perfil actualizado correctamente ✅"))
      .catch(() => alert("Error al actualizar el perfil ❌"));
    */

    alert("Perfil actualizado correctamente ✅");
  });
});
