const CARE_REQUEST_SERVICE_URL = "http://localhost:8083";

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.message || `Error ${response.status}`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getDiseases() {
  return requestJson(`${CARE_REQUEST_SERVICE_URL}/diseases`);
}

export function getMedications() {
  return requestJson(`${CARE_REQUEST_SERVICE_URL}/medications`);
}

export function getAllergies() {
  return requestJson(`${CARE_REQUEST_SERVICE_URL}/allergies`);
}

export function getConditions() {
  return requestJson(`${CARE_REQUEST_SERVICE_URL}/conditions`);
}

export function createCareRequest(payload) {
  return requestJson(`${CARE_REQUEST_SERVICE_URL}/care-requests/add`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCareRequest(id) {
  return requestJson(`${CARE_REQUEST_SERVICE_URL}/care-requests/${id}`, {
    method: "GET",
  });
}

export function getCareRequestsByStatus(status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return requestJson(`${CARE_REQUEST_SERVICE_URL}/care-requests${query}`, {
    method: "GET",
  });
}

export function updateCareRequestStatus(id, status, caretakerId) {
  return requestJson(`${CARE_REQUEST_SERVICE_URL}/care-requests/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({
      status,
      caretakerId,
      responseDate: new Date().toISOString(),
    }),
  });
}
