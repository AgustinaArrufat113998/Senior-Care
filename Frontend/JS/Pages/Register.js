// 📌 js/pages/register.js
import { registerUser } from "../api/user.js";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // 🔹 Obtener valores del formulario
  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const dni = document.getElementById("dni").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const fechaNacimiento = document.getElementById("fechaNacimiento").value;
  const genderId = document.getElementById("sexo").value; // debe ser el id del género
  const addressId = document.getElementById("direccion").value; // si lo pedís

  const msg = document.getElementById("msg");

  // 🔹 Validar contraseñas
  if (password !== confirmPassword) {
    msg.style.color = "red";
    msg.textContent = "⚠️ Las contraseñas no coinciden";
    return;
  }

  // 🔹 Crear objeto usuario
  const userData = {
    name: nombre,
    surname: apellido,
    username,
    email,
    password,
    dni,
    phone: telefono,
    birthDate: fechaNacimiento,
    genderId: Number(genderId),
    addressId: Number(addressId),
  };

  console.log("📤 Enviando datos de usuario:", userData);

  // 🔹 Enviar al backend
  const result = await registerUser(userData);

  if (result.ok) {
    msg.style.color = "green";
    msg.textContent = "✅ Usuario registrado con éxito. Redirigiendo...";
    setTimeout(() => (window.location.href = "login.html"), 1500);
  } else {
    msg.style.color = "red";
    msg.textContent =
      result.message ||
      `⚠️ Error al registrar usuario (código ${result.status})`;
  }
});



// document.getElementById("registerForm").addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const nombre = document.getElementById("nombre").value;
//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;
//   const confirmPassword = document.getElementById("confirmPassword").value;
//   const dni = document.getElementById("dni").value;
//   const telefono = document.getElementById("telefono").value;
//   const fechaNacimiento = document.getElementById("fechaNacimiento").value;
//   const sexo = document.getElementById("sexo").value;

//   if (password !== confirmPassword) {
//     document.getElementById("msg").innerText = "⚠️ Las contraseñas no coinciden";
//     return;
//   }

//   try {
//     const response = await fetch("http://localhost:8080/api/user/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         name: nombre,
//         email,
//         password,
//         dni,
//         phone: telefono,
//         birthDate: fechaNacimiento,
//         gender: sexo
//       })
//     });

//     if (response.ok) {
//       alert("✅ Usuario registrado con éxito. Ahora puede iniciar sesión.");
//       window.location.href = "login.html";
//     } else {
//       document.getElementById("msg").innerText = "⚠️ Error al registrar usuario";
//     }
//   } catch (err) {
//     console.error(err);
//     document.getElementById("msg").innerText = "⚠️ No se pudo conectar con la API";
//   }
// });
