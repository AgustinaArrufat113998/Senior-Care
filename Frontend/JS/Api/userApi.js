// URLs de las APIs
const API_USER_URL = "http://localhost:8081/api";
const API_GATEWAY_URL = "http://localhost:8080/api"; // se usara mas adelante

// ======================================================
// USUARIOS
// ======================================================

// Crear nuevo usuario (registro)
export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_USER_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || "Error al registrar usuario");
    }

    return data;
  } catch (error) {
    console.error("Error en registro:", error);
    throw error; // deja que el form.js lo maneje
  }
}

// Obtener usuario por ID
export async function getUserById(userId) {
  try {
    const response = await fetch(`${API_USER_URL}/users/${userId}`);
    if (!response.ok) throw new Error("Error al obtener usuario");
    return await response.json();
  } catch (error) {
    console.error("Error en getUserById:", error);
    return null;
  }
}

// ======================================================
// DIRECCIONES
// ======================================================

// Crear nueva calle
export async function createStreet(name, cityId) {
  try {
    const response = await fetch(`${API_USER_URL}/addresses/streets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, cityId: Number(cityId) }),
    });

    if (!response.ok) throw new Error("Error al crear la calle");
    return await response.json();
  } catch (error) {
    console.error("Error al crear la calle:", error);
    throw error;
  }
}

// Crear direccion
export async function createAddress(number, floor, apartment, streetId) {
  try {
    const response = await fetch(`${API_USER_URL}/addresses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number,
        floor,
        apartment,
        streetId: Number(streetId),
      }),
    });

    if (!response.ok) throw new Error("Error al crear la direccion");
    return await response.json();
  } catch (error) {
    console.error("Error al crear la direccion:", error);
    throw error;
  }
}

// ======================================================
// GETTERS PARA DROPDOWNS
// ======================================================

// Obtener paises
export async function getCountries() {
  try {
    const response = await fetch(`${API_USER_URL}/addresses/countries`);
    if (!response.ok) throw new Error("Error al obtener paises");
    return await response.json();
  } catch (error) {
    console.error("Error al obtener paises:", error);
    return [];
  }
}

// Obtener provincias por pais
export async function getProvincesByCountry(countryId) {
  try {
    const response = await fetch(
      `${API_USER_URL}/addresses/countriesId/cities?countryId=${countryId}`
    );
    if (!response.ok) throw new Error("Error al obtener provincias");
    return await response.json();
  } catch (error) {
    console.error("Error al obtener provincias:", error);
    return [];
  }
}

// Obtener generos
export async function getGender() {
  try {
    const response = await fetch(`${API_USER_URL}/genders`);
    if (!response.ok) throw new Error("Error al obtener generos");
    return await response.json();
  } catch (error) {
    console.error("Error al obtener generos:", error);
    return [];
  }
}
