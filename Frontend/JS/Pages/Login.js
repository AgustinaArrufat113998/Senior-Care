document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  await login(email, password); // 👈 importante
});

function logout() {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("userEmail");
  alert("Sesión cerrada");
  window.location.href = "LandingPage.html";
}
