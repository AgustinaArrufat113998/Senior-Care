$(document).ready(function () {
  $("#caregiverEditForm").on("submit", function (e) {
    e.preventDefault();

    const caregiverData = {
      estudios: $("#estudios").val(),
      experiencia: $("#experiencia").val(),
      disponibilidad: $("#disponibilidad").val(),
      tarifa: $("#tarifa").val(),
      contactoSecundario: $("#contactoSecundario").val(),
    };

    console.log("Datos del cuidador actualizados:", caregiverData);

    /*
    fetch("http://localhost:8000/api/caregivers/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(caregiverData),
    })
      .then(res => res.json())
      .then(() => alert("Perfil actualizado correctamente ✅"))
      .catch(() => alert("Error al actualizar el perfil ❌"));
    */

    alert("Perfil actualizado correctamente ✅");
  });
});
