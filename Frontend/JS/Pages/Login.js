import { login } from "../Api/Auth.js";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  await login(email, password);
});

export function logout() {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  alert("Sesión cerrada");
  window.location.href = "LandingPage.html";
}

