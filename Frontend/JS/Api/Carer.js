// === Js/Api/Carer.js ===

const API_USER_URL = "http://localhost:8081/api";

/**
 * 🔹 Obtiene todas las especialidades desde la base de datos
 */
export async function getSpecialties() {
  try {
    const response = await fetch(`${API_USER_URL}/specialty/all`);
    if (!response.ok) throw new Error("Error al obtener especialidades");
    return await response.json();
  } catch (error) {
    console.error("Error en getSpecialties:", error);
    return [];
  }
}

/**
 * 🔹 Obtiene todas las habilidades desde la base de datos
 */
export async function getSkills() {
  try {
    const response = await fetch(`${API_USER_URL}/skill/all`);
    if (!response.ok) throw new Error("Error al obtener habilidades");
    return await response.json();
  } catch (error) {
    console.error("Error en getSkills:", error);
    return [];
  }
}

/**
 * 🔹 Crea un nuevo cuidador en la base de datos
 */
export async function createCarer(carerData) {
  try {
    const token = localStorage.getItem("jwtToken"); // JWT guardado tras login
    const response = await fetch(`${API_USER_URL}/carer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      },
      body: JSON.stringify(carerData)
    });

    if (!response.ok) throw new Error("Error al crear cuidador");
    return await response.json();
  } catch (error) {
    console.error("Error en createCarer:", error);
    throw error;
  }
}
