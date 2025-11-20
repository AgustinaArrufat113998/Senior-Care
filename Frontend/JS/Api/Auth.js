// js/api/auth.js
const AUTH_URL = "http://localhost:8082/api/auth/login"; // 🔥 luego lo cambiás al Gateway

export async function login(email, password) {
  try {
    const response = await fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const msg = document.getElementById("msg");

    if (!response.ok) {
      msg.textContent = "❌ Credenciales inválidas";
      return;
    }

    const data = await response.json();
    console.log("Respuesta login:", data);

    // Guardamos el JWT y datos del usuario
    localStorage.setItem("jwtToken", data.token);
    localStorage.setItem("userEmail", data.email);
    localStorage.setItem("userRole", data.role);
    if (data.id) {
      localStorage.setItem("userId", data.id);
    }

    msg.style.color = "green";
    msg.textContent = "✅ Inicio de sesión exitoso";

    // Redirigir a página protegida
    setTimeout(() => {
      window.location.href = "Home.html"; // ajustá a tu página principal
    }, 1500);
  } catch (error) {
    console.error("Error de login:", error);
    const msg = document.getElementById("msg");
    msg.textContent = "⚠️ Error en el servidor";
  }
}
