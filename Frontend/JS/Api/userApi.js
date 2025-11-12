// 🌐 URLs de las APIs
const API_USER_URL = "http://localhost:8081/api";
const API_GATEWAY_URL = "http://localhost:8080/api"; // 🔥 se usará más adelante

// ======================================================
// 🧱 USUARIOS
// ======================================================

// 🟩 Crear nuevo usuario (registro)
export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_USER_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      alert("Error al registrar usuario: " + (errorData.message || response.statusText));
      throw new Error(errorData.message || "Error al registrar usuario");
    }

    const data = await response.json();
    alert("Usuario registrado con éxito");
    console.log("✅ Usuario registrado:", data);
    return data;
  } catch (error) {
    alert("Error en el registro del usuario.");
    console.error("❌ Error en registro:", error);
    throw error;
  }
}

// ======================================================
// 🧱 DIRECCIONES
// ======================================================

// 🏠 Crear nueva calle
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
    console.error("❌ Error al crear la calle:", error);
    throw error;
  }
}

// 🏢 Crear dirección
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

    if (!response.ok) throw new Error("Error al crear la dirección");
    return await response.json();
  } catch (error) {
    console.error("❌ Error al crear la dirección:", error);
    throw error;
  }
}

// ======================================================
// 🧱 GETTERS PARA DROPDOWNS
// ======================================================

// 🌍 Obtener países
export async function getCountries() {
  try {
    const response = await fetch(`${API_USER_URL}/addresses/countries`);
    if (!response.ok) throw new Error("Error al obtener países");
    return await response.json();
  } catch (error) {
    console.error("❌ Error al obtener países:", error);
    return [];
  }
}

// 🗺️ Obtener provincias por país
export async function getProvincesByCountry(countryId) {
  try {
    const response = await fetch(
      `${API_USER_URL}/addresses/countriesId/cities?countryId=${countryId}`
    );
    if (!response.ok) throw new Error("Error al obtener provincias");
    return await response.json();
  } catch (error) {
    console.error("❌ Error al obtener provincias:", error);
    return [];
  }
}

// 🚻 Obtener géneros
export async function getGender() {
  try {
    const response = await fetch(`${API_USER_URL}/genders`);
    if (!response.ok) throw new Error("Error al obtener géneros");
    return await response.json();
  } catch (error) {
    console.error("❌ Error al obtener géneros:", error);
    return [];
  }
}
