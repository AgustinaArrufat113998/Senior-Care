const API_USER_URL = "http://localhost:8081/api";

export async function getFamilyByUser(userId) {
  const res = await fetch(`${API_USER_URL}/family?userId=${userId}`);
  if (res.status === 204) return [];
  if (!res.ok) throw new Error("No se pudo obtener la familia");
  return res.json();
}

export async function getFamiliar(id) {
  const res = await fetch(`${API_USER_URL}/family/${id}`);
  if (!res.ok) throw new Error("No se pudo obtener el familiar");
  return res.json();
}

export async function addFamiliar(payload) {
  const res = await fetch(`${API_USER_URL}/family`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "No se pudo crear el familiar");
  }
  return res.json();
}

export async function updateFamiliar(id, payload) {
  const res = await fetch(`${API_USER_URL}/family/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "No se pudo actualizar el familiar");
  }
  return res.json();
}

export async function deleteFamiliar(id) {
  const res = await fetch(`${API_USER_URL}/family/${id}`, {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 204) {
    const txt = await res.text();
    throw new Error(txt || "No se pudo eliminar el familiar");
  }
}
