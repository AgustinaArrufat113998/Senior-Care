document.addEventListener("DOMContentLoaded", () => {
  const role = (localStorage.getItem("userRole") || "").toUpperCase();
  const ctaButton = document.getElementById("ctaButton");

  if (ctaButton && role === "ADMIN") {
    ctaButton.textContent = "Dashboard";
    ctaButton.onclick = () => (window.location.href = "Dashboard.html");
  }

  document.querySelectorAll(".btn-outline-primary").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert("Funcionalidad próximamente disponible");
    });
  });
});
