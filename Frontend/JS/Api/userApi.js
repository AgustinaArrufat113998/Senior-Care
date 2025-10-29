//Urls de la API
const API_USER_URL = "http://localhost:8081/api";
const API_AUTH_URL = "http://localhost:8082/api/auth";
const API_GATEWAY_URL = "http://localhost:8080/api";

// Función para registrar un nuevo usuario
export async function registerUser(userData) {
  const response = await fetch(`${API_USER_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error en el registro");
  }
  return await response.json(); // opcional
}

// === Create Address ===
export async function createStreet(name, cityId) {
  const response = await fetch(`${API_USER_URL}/addresses/streets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      name: name,
      cityId: Number(cityId)
    })
  });
  if (!response.ok) throw new Error("Error al crear la calle");
  return await response.json();
}

export async function createAddress(number, floor, apartment, streetId) {
  const response = await fetch(`${API_USER_URL}/addresses`, { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      number: number,
      floor: floor,
      apartment: apartment,
      streetId: Number(streetId)
    }),
  });
  if (!response.ok) throw new Error("Error al crear la dirección");
  return await response.json();
}

  export async function login(email, password) {
  const msg = document.getElementById("msg");
  msg.innerText = "🔄 Verificando...";
  msg.style.color = "black";

  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 404) {
        msg.style.color = "red";
        msg.innerText = "❌ Usuario o contraseña incorrectos";
      } else {
        msg.style.color = "orange";
        msg.innerText = "⚠️ Error en el servidor";
      }
      return; // evita seguir ejecutando
    }

    // ✅ Obtener el JSON con el token
    const data = await response.json();

    // ✅ Guardar token en el navegador
    localStorage.setItem("jwtToken", data.token);
    localStorage.setItem("userEmail", email);

    msg.style.color = "green";
    msg.innerText = "✅ Bienvenido " + email;

    // (Opcional) redirigir después de 1 segundo
    setTimeout(() => {
      window.location.href = "Home.html";
    }, 1000);

  } catch (err) {
    console.error("Error al conectar con la API:", err);
    msg.style.color = "red";
    msg.innerText = "⚠️ No se pudo conectar con la API";
  }
}

async function registerCarer(carerData) {
  const response = await fetch("http://localhost:8080/api/carers/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(carerData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error en el registro");
  }

  return await response.json(); // opcional
}

async function getUsers() {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    alert("Debes iniciar sesión primero.");
    return;
  }

  const response = await fetch("http://localhost:8080/api/users", {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    alert("Token inválido o sesión expirada. Inicia sesión nuevamente.");
    localStorage.removeItem("jwtToken");
    return;
  }

  const users = await response.json();
  console.log(users);
}

// === Getters for DropDownTable ===
export async function getCountries() {
  try {
    const response = await fetch(`${API_USER_URL}/addresses/countries`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify()
    });

    if (!response.ok) throw new Error("Error al obtener países");
    return await response.json();
  } catch (error) {
    console.error("Error al obtener países:", error);
    return [];
  }
}

export async function getProvincesByCountry(countryId) {
  try {
    const response = await fetch(`${API_USER_URL}/addresses/countriesId/cities?countryId=${countryId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify()
    });
    if (!response.ok) throw new Error("Error al obtener provincias");
    return await response.json();
  } catch (error) {
    console.error("Error al obtener provincias:", error);
    return [];
  }
}

export async function getGender() {
  try {
    const response = await fetch(`${API_USER_URL}/genders`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify()
    });
    console.log("Respuesta de géneros:", response);

    if (!response.ok) throw new Error("Error al obtener géneros");
    return await response.json();
  } catch (error) {
    console.error("Error al obtener géneros:", error);
    return [];
  }
}
