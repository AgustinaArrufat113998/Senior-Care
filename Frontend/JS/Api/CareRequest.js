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

export function getSpecialties() {
  return requestJson(`${CARE_REQUEST_SERVICE_URL}/care-requests/specialties`);
}

export function createCareRequest(payload) {
  return requestJson(`${CARE_REQUEST_SERVICE_URL}/care-requests/add`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
