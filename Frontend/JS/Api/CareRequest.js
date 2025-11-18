// 🌐 URLs de las APIs
const API_CARERQUEST_URL = "http://localhost:8083/api";
const API_GATEWAY_URL = "http://localhost:8080/api";

// ======================================================
// 🧱 SOLICITUDES DE CUIDADO
// ======================================================

// 🟩 Crear nueva solicitud de cuidado
export async function createCareRequest(careRequestData) {
  try {
    const response = await fetch(`${API_CARERQUEST_URL}/care-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(careRequestData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      alert("Error al crear la solicitud de cuidado: " + (errorData.message || response.statusText));
      throw new Error(errorData.message || "Error al crear la solicitud de cuidado");
    }
    const data = await response.json();
    alert("Solicitud de cuidado creada con éxito");
    console.log("✅ Solicitud de cuidado creada:", data);
    return data;
  } catch (error) {
    alert("Error en la creación de la solicitud de cuidado.");
    console.error("❌ Error en creación de solicitud de cuidado:", error);
    throw error;
  } 
}