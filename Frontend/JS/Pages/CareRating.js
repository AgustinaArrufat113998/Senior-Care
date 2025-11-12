$(document).ready(function() {
  let ratingValue = 0;

  // Interacción con estrellas
  $(".star").on("click", function() {
    ratingValue = $(this).data("value");
    $(".star").removeClass("active");
    $(this).addClass("active").prevAll().addClass("active");
    $("#ratingText").text(`Calificación: ${ratingValue} / 5`);
  });

  // Envío del formulario
  $("#ratingForm").on("submit", function(e) {
    e.preventDefault();

    if (ratingValue === 0) {
      alert("Por favor seleccioná una calificación con estrellas ⭐");
      return;
    }

    const data = {
      cuidador: $("#nombreCuidador").text(),
      rating: ratingValue,
      comentario: $("#comentario").val(),
      puntualidad: $("#puntualidad").val(),
      trato: $("#trato").val(),
    };

    console.log("Valoración enviada:", data);

    // Ejemplo de request al backend
    /*
    fetch("http://localhost:8000/api/care-ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(() => alert("¡Gracias por tu valoración! 💙"))
      .catch(() => alert("Error al enviar la valoración"));
    */

    alert("¡Gracias por tu valoración! 💙");
    $("#ratingForm")[0].reset();
    $(".star").removeClass("active");
    $("#ratingText").text("");
  });
});
