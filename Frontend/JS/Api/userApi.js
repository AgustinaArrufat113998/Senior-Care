// 📌 js/api/user.js

const USER_API_URL = "http://localhost:8081/api/users"; // 🔥 luego pasa a gateway (8080)

/**
 * Registra un nuevo usuario en el sistema
 * @param {Object} userData - Datos del usuario a registrar
 * @returns {Promise<{ok: boolean, status: number, message?: string}>}
 */
export async function registerUser(userData) {
  try {
    const response = await fetch(`${USER_API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { ok: false, status: response.status, message: errorText };
    }

    return { ok: true, status: response.status };
  } catch (error) {
    console.error("❌ Error al conectar con el backend:", error);
    return { ok: false, status: 500, message: "No se pudo conectar con el servidor" };
  }
}


// async function login(email, password) {
//   const msg = document.getElementById("msg");
//   msg.innerText = "🔄 Verificando...";
//   msg.style.color = "black";

//   try {
//     const response = await fetch("http://localhost:8080/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     if (!response.ok) {
//       if (response.status === 401 || response.status === 404) {
//         msg.style.color = "red";
//         msg.innerText = "❌ Usuario o contraseña incorrectos";
//       } else {
//         msg.style.color = "orange";
//         msg.innerText = "⚠️ Error en el servidor";
//       }
//       return; // evita seguir ejecutando
//     }

//     // ✅ Obtener el JSON con el token
//     const data = await response.json();

//     // ✅ Guardar token en el navegador
//     localStorage.setItem("jwtToken", data.token);
//     localStorage.setItem("userEmail", email);

//     msg.style.color = "green";
//     msg.innerText = "✅ Bienvenido " + email;

//     // (Opcional) redirigir después de 1 segundo
//     setTimeout(() => {
//       window.location.href = "Home.html";
//     }, 1000);

//   } catch (err) {
//     console.error("Error al conectar con la API:", err);
//     msg.style.color = "red";
//     msg.innerText = "⚠️ No se pudo conectar con la API";
//   }
// }

// async function registerCarer(carerData) {
//   const response = await fetch("http://localhost:8080/api/carers/register", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(carerData)
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || "Error en el registro");
//   }

//   return await response.json(); // opcional
// }

// async function getUsers() {
//   const token = localStorage.getItem("jwtToken");
//   if (!token) {
//     alert("Debes iniciar sesión primero.");
//     return;
//   }

//   const response = await fetch("http://localhost:8080/api/users", {
//     headers: {
//       "Authorization": `Bearer ${token}`,
//     },
//   });

//   if (response.status === 401) {
//     alert("Token inválido o sesión expirada. Inicia sesión nuevamente.");
//     localStorage.removeItem("jwtToken");
//     return;
//   }

//   const users = await response.json();
//   console.log(users);
// }
